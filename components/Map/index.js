import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import Tooltip from "./_Tooltip";
import ZoomBttns from "./_ZoomBttns";
import Legend from "./_Legend";

export default function Map({ statesGeo = {}, localsGeo = {}, filteredActivities = [], activeActivity, activeState, setActiveActivity, setActiveState }) {
	const [mapSizes, setMapSizes] = useState({});
	const [mapTransform, setMapTransform] = useState({ k:1, x:0, y:0 });
	const [mapIsReady, setMapIsReady] = useState(false);
	const [pointData, setPointData] = useState(null);
	const [stateData, setStateData] = useState(null);
	const [filteredIndices, setFilteredIndices] = useState([]);
	const [hoveredFeature, setHoveredFeature] = useState(null);
	const [activeFeature, setActiveFeature] = useState(null);

	const mapRef = useRef({});
	const svgRef = useRef({});

	const MIN_ZOOM = .7;
	const MAX_ZOOM = 4;
	const STROKE_COLOR_DEFAULT = "#99ABB0";
	const STROKE_COLOR_ACTIVE = "#363A3E";
	const STROKE_WIDTH_DEFAULT = 1;
	const STROKE_WIDTH_ACTIVE = 2;
	const CIRCLE_RADIUS = 5;
	const MARKER_SIZE = 6;
	const DC_SIZE = 30;
	const DC_OFFSET_X = 90;
	const DC_OFFSET_Y = -20;

	const dcOffset = [90, -20];

	const stateColors = [
		"#FCFCFF",
		"#DEE2E4",
		"#D4DFE3"
	];
	
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
		setFilteredIndices(filteredActivities.map(d => d.index));
	}, [filteredActivities]);

	useEffect(() => {
		updateMapStyle();
	}, [filteredIndices, hoveredFeature, activeActivity, activeState, mapTransform]);

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		const g = svg.select("g");
		g.attr("transform", mapTransform);
		g.selectAll(".local path")
			.attr("transform", scaleNode)
		g.select(".federal-icon")
			.attr("transform", scaleNode)
		g.select(".federal-line")
			.attr("stroke-width", STROKE_WIDTH_DEFAULT / mapTransform.k)
		svg.classed("moving", true);
	}, [mapTransform]);

	const onResize = () => {
		const mapStyle = getComputedStyle(mapRef.current);
		let width = parseFloat(mapStyle.width);
		let height = parseFloat(mapStyle.height);

		setMapSizes({
			width: width,
			height: height,
		});
	}

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

	const addLocal = () => {
		const locals = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "local")
			.selectAll("path")
				.data(localsGeo.features)
			.enter().append("path")
				.attr("d", d => localShapes[d.properties.level])
				.attr("fill", d => localColors[d.properties.level])
				.attr("opacity", d => d.properties.progress === "Enacted" ? 1 : .5)
				.attr("transform", d => `translate(${translateLocal(d)}) scale(${mapTransform.k})`)
				.attr("cursor", "pointer")
				.on("mouseover", onHoverFeature)
				.on("mouseout", onUnhoverFeature)
				.on("click", onClickFeature)
				.on("dblclick", (e) => e.stopPropagation());
	};

	const addStates = () => {
		const states = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "states")
			.selectAll("path")
				.data(statesGeo.features)
				.attr("stroke-width", STROKE_WIDTH_DEFAULT)
			.enter().append("path")
				.attr("stroke", STROKE_COLOR_DEFAULT)
				.attr("d", geoPath)
				.attr("cursor", "pointer")
				.on("mouseover", onHoverFeature)
				.on("mouseout", onUnhoverFeature)
				.on("click", onClickFeature)
				.on("dblclick", (e) => e.stopPropagation());
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
				.attr("stroke-width", STROKE_WIDTH_DEFAULT)
				.attr("stroke", STROKE_COLOR_DEFAULT)
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
			.append("g")
			.append("rect")
			.attr("fill", "#E6F0F3")
			.attr("stroke", STROKE_COLOR_DEFAULT)
			.attr("stroke-width", STROKE_WIDTH_DEFAULT)
			.attr("rx", 6)
			.attr("ry", 6)
			.attr("transform", d => `translate(${-DC_SIZE/2}, ${-DC_SIZE/2})`)
			.attr("width", DC_SIZE)
			.attr("height", DC_SIZE)
			.attr("cursor", "pointer")
			.on("mouseover", onHoverFeature)
			.on("mouseout", onUnhoverFeature)
			.on("click", onClickFeature)
			.on("dblclick", (e) => e.stopPropagation());

		dcMarker
			.append("image")
			.attr("xlink:href", d => "IconFederal.svg")
			.attr("width", `${DC_SIZE * .75}px`)
			.attr("height", `${DC_SIZE * .75}px`)
			.attr("transform", d => `translate(${-DC_SIZE/2 * .75}, ${-DC_SIZE/2 * .75})`)
			.attr("pointer-events", "none");

		// dcMarker
		// 	.select("image")
		// 	.on("mouseover", onHoverFeature)
		// 	.on("mouseout", onUnhoverFeature)
		// 	.on("click", onClickFederalFeature)
		// 	.on("dblclick", (e) => e.stopPropagation());
	};


	const onClickFeature = (e, d) => {
		setActiveFeature(d);
		switch(d.properties.type) {
			case "state":
				onClickStateFeature(e, d);
				break;
			case "federal":
				onClickFederalFeature(e, d);
				break;
			case "local":
				onClickLocalFeature(e, d);
				break;
			default:
				break;
		}
	};

	const onClickFederalFeature = (e, d) => {
		const elem = e.target,
					path = d3.select(elem),
					states = d3.select(svgRef.current).selectAll(".states path");
		// states.attr("stroke", STROKE_COLOR_DEFAULT);
		// elem.parentElement.appendChild(elem);
		// path.attr("stroke", STROKE_COLOR_ACTIVE);
		setActiveActivity(null);
		setActiveState(null);
		setActiveState(d.properties);
	}

	const onClickStateFeature = (e, d) => {
		const elem = e.target,
					path = d3.select(elem),
					states = d3.select(svgRef.current).selectAll(".states path, .federal-icon rect");
		// states.attr("stroke", STROKE_COLOR_DEFAULT);
		elem.parentElement.appendChild(elem);
		// path.attr("stroke", STROKE_COLOR_ACTIVE);
		setActiveActivity(null);
		setActiveState(null);
		setActiveState(d.properties);
	}

	const onClickLocalFeature = (e, d) => {
		setActiveState(null);
		setActiveActivity(filteredActivities.find(a => a.index === d.properties.index));
	}

	const onHoverFeature = (e, d) => {
		const elem = e.target,
					path = d3.select(elem),
					parent = d3.select(elem.parentElement),
					g = d3.select(svgRef.current).select("g");

		let coords, data;
		let offsetX = 0;
		let offsetY = 0;
		if(d.properties.type === "state" || d.properties.type === "federal") {
			data = d.properties;
			const stateActivities = filteredActivities.filter(a => a["State/US"] === data.state && ["State","Federal"].includes(a["Level"]))
			data.introduced = stateActivities.filter(a => a["Progress"] !== "Enacted").length;
			data.passed = stateActivities.filter(a => a["Progress"] === "Enacted").length;
		}
		if(d.properties.type === "state") {
			coords = projection(d3.geoCentroid(d.geometry));
			const activeState = parent.select(`path[stroke="${STROKE_COLOR_ACTIVE}"]`);
			if(activeState.empty()) {
				parent.node().appendChild(elem);
			} else {
				parent.node().insertBefore(elem, activeState.node());
			}
			// d.properties.hovered = true;
			// path.attr("stroke-width", getStrokeWidth);
		}
		if(d.properties.type === "federal") {
			const dcCoords = d.geometry.coordinates[0][0][4];
			coords = [
				projection(dcCoords)[0] + dcOffset[0],
				projection(dcCoords)[1] + dcOffset[1]
			];
			// d.properties.hovered = true;
			// path.attr("stroke-width", getStrokeWidth);
		}
		if(d.properties.type === "local") {
			coords = projection(d.geometry.coordinates);
			data = filteredActivities.find(a => a.index === d.properties.index)
			offsetX = MARKER_SIZE;
		}
		if(coords) setHoveredFeature({ ...data, coords, offset: [offsetX, offsetY] });
	}

	const onUnhoverFeature = (e, d) => {
		if(d3.select(svgRef.current).classed("moving")) return;
		setHoveredFeature(null);
		const elem = e.target,
					path = d3.select(elem);
		// if(path.attr("stroke")) {
			// delete d.properties.hovered;
			// path.attr("stroke-width", getStrokeWidth);
		// }
	}

	const onZoomClick = (e) => {
		const svg = d3.select(svgRef.current);
		const zoomLevel = e.target.innerText === "+" ? 1.3 : 1 / 1.3;
		zoom.scaleBy(svg.transition().duration(300), zoomLevel);
	};

	const zoomed = (e) => {
		const { transform } = e;
		setMapTransform(transform);
	};

	const zoom = d3.zoom()
		.scaleExtent([MIN_ZOOM, MAX_ZOOM])
		.on("zoom", zoomed)
		.on("end", e => d3.select(svgRef.current).classed("moving", false));

	const scaleNode = (d, i, paths) => {
		const path = d3.select(paths[i]);
		const transform = path.attr("transform");
		if(!transform) return;
		const transformSplit = transform.split("scale(");
		const transformBegin = transformSplit[0];
		return [transformBegin,`scale(${1/mapTransform.k})`].join("");
	}

	const translateLocal = (d) => {
		return projection(d.geometry.coordinates).map(l => l - MARKER_SIZE/2);
	}

	const updateMapStyle = () => {
		const svg = d3.select(svgRef.current);
		svg.selectAll(".local path")
			.attr("visibility", d => filteredIndices.includes(d.properties.index) ? "visisble" : "hidden");

		// svg.selectAll(".locals path")
		// 	.attr("fill")

		svg.selectAll(".states path")
			.attr("fill", d => {
				const stateActivities = filteredActivities.filter(a => a["Level"] === "State" && a["State/US"] === d.properties.state);
				if(!stateActivities.length) return stateColors[0];
				if(stateActivities.filter(d => d["Progress"] === "Enacted").length) return stateColors[2];
				return stateColors[1];
			})
			.attr("stroke-width", d => {
				let strokeWidth;
				if(hoveredFeature) {
					strokeWidth = d.properties.index === hoveredFeature.index
						? STROKE_WIDTH_ACTIVE : STROKE_WIDTH_DEFAULT;
				} else {
					strokeWidth = STROKE_WIDTH_DEFAULT;
				}
				return strokeWidth / mapTransform.k;
			})
			.attr("stroke", d => {
				return d.properties.index === (activeState ? activeState.index : null)
					? STROKE_COLOR_ACTIVE
					: STROKE_COLOR_DEFAULT
			});

		svg.select(".federal-icon rect")
			.attr("fill", d => {
				const federalActivities = filteredActivities.filter(a => a["Level"] === "Federal" && a["State/US"] === d.properties.state);
				if(!federalActivities.length) return stateColors[0];
				if(federalActivities.filter(d => d["Progress"] === "Enacted").length) return stateColors[2];
				return stateColors[1];
			})
			.attr("stroke-width", d => {
				let strokeWidth;
				if(hoveredFeature) {
					strokeWidth = d.properties.index === hoveredFeature.index
						? STROKE_WIDTH_ACTIVE : STROKE_WIDTH_DEFAULT;
				} else {
					strokeWidth = STROKE_WIDTH_DEFAULT;
				}
				return strokeWidth / mapTransform.k;
			})
			.attr("stroke", d => {
				return d.properties.index === (activeState ? activeState.index : null)
					? STROKE_COLOR_ACTIVE
					: STROKE_COLOR_DEFAULT
			});
		svg.select(".federal-icon image")
			.attr("style", d => {
				return d.properties.index === (activeState ? activeState.index : null)
					? "filter: brightness(0)"
					: ""
			});
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
					stateColors={stateColors} />

			</div>
		</>
	)
}