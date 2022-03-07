import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import Tooltip from "./_Tooltip";
import ZoomBttns from "./_ZoomBttns";
import Legend from "./_Legend";

export default function Map({ statesGeo = {}, pointsGeo = {}, filteredData = [], setActiveActivity, setActiveState }) {
	const [mapSizes, setMapSizes] = useState({});
	const [mapTransform, setMapTransform] = useState({ k:1, x:0, y:0 });
	const [mapIsReady, setMapIsReady] = useState(false);
	const [pointData, setPointData] = useState(null);
	const [stateData, setStateData] = useState(null);
	const [filteredIndices, setFilteredIndices] = useState([]);
	const [hoveredFeature, setHoveredFeature] = useState(null);

	const mapRef = useRef({});
	const svgRef = useRef({});

	const MIN_ZOOM = .8;
	const MAX_ZOOM = 4;
	const STROKE_WIDTH = 1;
	const CIRCLE_RADIUS = 5;
	const MARKER_SIZE = 6;
	const DC_SIZE = 30;
	const DC_OFFSET_X = 90;
	const DC_OFFSET_Y = -20;

	const dcOffset = [90, -20];
	const stateRange = ["#FCFCFF", "#E9EFF1", "#D4DFE3"];
	const localColors = {
		LocalSch: "#C66E3B",
		LocalOth: "#5B5D84"
	};
	const localShapes = {
		LocalSch: `M 0, ${MARKER_SIZE} a ${MARKER_SIZE},${MARKER_SIZE} 0 1,0 ${MARKER_SIZE * 2},0 a ${MARKER_SIZE},${MARKER_SIZE} 0 1,0 -${MARKER_SIZE * 2},0`,
		LocalOth: `M${MARKER_SIZE} 1L${MARKER_SIZE*2} ${MARKER_SIZE*2}H0L${MARKER_SIZE} 1Z`
	};

	let projection = d3.geoAlbersUsa();
	let geoPath;

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		setMapIsReady(false);
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		if(!Object.keys(mapSizes).length) return;
		if(mapIsReady) return;
		setUpMap();
		addStates();
		addLocal();
		addFed();
	}, [mapSizes]);

	useEffect(() => {
		setFilteredIndices(filteredData.map(d => d.index));
	}, [filteredData]);

	useEffect(() => {
		filterMap();
	}, [filteredIndices]);

	const onResize = () => {
		const mapStyle = getComputedStyle(mapRef.current);
		let width = parseFloat(mapStyle.width);
		let height = parseFloat(mapStyle.height);

		setMapSizes({
			width: width,
			height: height,
		});
	}

	const zoomed = (e) => {
		const svg = d3.select(svgRef.current);
		const g = svg.select("g");
		const { transform } = e;
		g.attr("transform", transform);
		g.attr("stroke-width", STROKE_WIDTH / transform.k);
		g.selectAll(".local path")
			.attr("transform", d => `translate(${projection(d.geometry.coordinates)}) scale(${1/transform.k})`)
		g.select(".federal-line")
			.attr("stroke-width", STROKE_WIDTH / transform.k);
		g.select(".federal-icon")
			.attr("transform", d => `translate(${[
				projection(d.geometry.coordinates[0][0][4])[0] + dcOffset[0],
				projection(d.geometry.coordinates[0][0][4])[1] + dcOffset[1]
			]}) scale(${1/transform.k})`)
		svg.classed("moving", true);
		setMapTransform(transform);
	};

	const zoom = d3.zoom()
		.scaleExtent([MIN_ZOOM, MAX_ZOOM])
		.on("zoom", zoomed)
		.on("end", e => d3.select(svgRef.current).classed("moving", false));

	const setUpMap = () => {
		const svg = d3.select(svgRef.current),
					svgWidth = +svg.attr("width"),
					svgHeight = +svg.attr("height");
		projection = d3.geoAlbersUsa().fitSize([svgWidth, svgHeight], statesGeo);
		svg.append("g");
		geoPath = d3.geoPath()
			.projection(projection);
		svg.call(zoom);
		setMapIsReady(true);
	};

	const addFed = () => {
		const dcGeo = statesGeo.features.filter(d => d.properties.state === "US"),
					dcCoords = dcGeo[0].geometry.coordinates[0][0][4];

		d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "federal");

		const dcLine = d3.select(svgRef.current)
			.select("g.federal")
			.append("line")
				.attr("class", "federal-line")
				.attr("stroke-width", STROKE_WIDTH)
				.attr("stroke", "black")
				.attr("x1", projection(dcCoords)[0])
				.attr("y1", projection(dcCoords)[1])
				.attr("x2", projection(dcCoords)[0] + dcOffset[0])
				.attr("y2", projection(dcCoords)[1] + dcOffset[1]);
	
		const dcMarker = d3.select(svgRef.current)
			.select("g.federal")
			.selectAll("path")
				.data(dcGeo)
			.enter().append("g")
				.attr("class", "federal-icon")
				.attr("transform", d => `translate(${[
					projection(dcCoords)[0] + dcOffset[0],
					projection(dcCoords)[1] + dcOffset[1]
				]})`);

		dcMarker
			.append("rect")
			.attr("fill", "#E6F0F3")
			.attr("stroke", "#99ABB0")
			.attr("stroke-width", "1px")
			.attr("rx", 6)
			.attr("ry", 6)
			.attr("transform", d => `translate(${-DC_SIZE/2}, ${-DC_SIZE/2})`)
			.attr("width", DC_SIZE)
			.attr("height", DC_SIZE)

		dcMarker
			.append("image")
			.attr("xlink:href", d => "IconFederal.svg")
			.attr("width", `${DC_SIZE * .75}px`)
			.attr("height", `${DC_SIZE * .75}px`)
			.attr("transform", d => `translate(${-DC_SIZE/2 * .75}, ${-DC_SIZE/2 * .75})`)
			.attr("cursor", "pointer");

		dcMarker
			.select("image")
			.on("mouseover", onHoverFeature)
			.on("mouseout", onUnhoverFeature)
			.on("click", onClickStateFeature)
			.on("dblclick", (e) => e.stopPropagation());
	};

	const addStates = () => {
		const states = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "states")
			.selectAll("path")
				.data(statesGeo.features)
				.attr("stroke-width", `${STROKE_WIDTH}px`)
			.enter().append("path")
				.attr("stroke", "black")
				.attr("fill", d => {
					if(!d.properties.activities.length) return stateRange[0];
					if(d.properties.activities.filter(d => d["Summary Status"] === "Enacted").length) return stateRange[2];
					return stateRange[1];
				})
				.attr("d", geoPath)
				.attr("cursor", "pointer")
				.on("mouseover", onHoverFeature)
				.on("mouseout", onUnhoverFeature)
				.on("click", onClickStateFeature)
				.on("dblclick", (e) => e.stopPropagation());
	};

	const addLocal = () => {
		console.log(pointsGeo);
		const points = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("transform", d => `translate(-${MARKER_SIZE/2}, -${MARKER_SIZE/2})`)
					.attr("class", "local")
			.selectAll("path")
				.data(pointsGeo.features)
			.enter().append("path")
				.attr("d", d => localShapes[d.properties["Level"]])
				.attr("fill", d => localColors[d.properties["Level"]])
				.attr("opacity", d => d.properties["Summary Status"] === "Enacted" ? 1 : .5)
				// .attr("fill", d => localColors[d.properties["Level"]][d.properties["Summary Status"] === "Enacted" ? 1 : 0])
				.attr("transform", d => `translate(${projection(d.geometry.coordinates)})`)
				.attr("cursor", "pointer")
				// .attr("style", "filter: drop-shadow(0px 2px 1px rgba(0,0,0,.4))")
				.on("mouseover", onHoverFeature)
				.on("mouseout", onUnhoverFeature)
				.on("click", onClickLocalFeature)
				.on("dblclick", (e) => e.stopPropagation());
	};

	const onClickStateFeature = (e, d) => {
		setActiveActivity(null);
		setActiveState(d.properties);
	}

	const onClickLocalFeature = (e, d) => {
		setActiveState(null);
		setActiveActivity(d.properties);
	}

	const onHoverFeature = (e, d) => {
		const g = d3.select(svgRef.current).select("g");
		let coords, offsetX;
		if(d.properties.hasOwnProperty("Level")) {
			coords = projection(d.geometry.coordinates);
			offsetX = MARKER_SIZE;
		}
		if(d.properties.state && d.properties.state !== "US") {
			coords = projection(d3.geoCentroid(d.geometry));
			offsetX = MARKER_SIZE;
		}
		if(d.properties.state && d.properties.state === "US") {
			const dcCoords = d.geometry.coordinates[0][0][4];
			coords = [
				projection(dcCoords)[0] + dcOffset[0],
				projection(dcCoords)[1] + dcOffset[1]
			];
			offsetX = 0;
		}
		if(coords) setHoveredFeature({ ...d.properties, coords, offsetX });
	}

	const onUnhoverFeature = (e, d) => {
		if(!d3.select(svgRef.current).classed("moving")) setHoveredFeature(null);
	}

	const onZoomClick = (e) => {
		const zoomLevel = e.target.innerText === "+" ? 1.3 : 0.7;
		d3.select(svgRef.current).transition()
			.delay(0)
			.duration(300)
			.call(zoom.scaleBy, zoomLevel);
	};

	const filterMap = () => {
		d3.select(svgRef.current)
			.selectAll(".local path")
			.attr("visibility", d => filteredIndices.includes(d.properties.index) ? "visisble" : "hidden");
	};

	return (
		<>
			<Helmet>
				<body className="overflow-hidden" />
			</Helmet>
			<div ref={mapRef}
				className={`w-full h-full relative`}>

				<div className="w-full h-full relative">
					<svg ref={svgRef}
						width={mapSizes.width}
						height={mapSizes.height} />
				</div>

				<ZoomBttns
					onZoomClick={onZoomClick} />

				{hoveredFeature ?
					<Tooltip
						data={hoveredFeature}
						transform={mapTransform} />
				: null}

				<Legend
					localColors={localColors}
					stateColors={stateRange} />

			</div>
		</>
	)
}