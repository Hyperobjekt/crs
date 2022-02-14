import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import Tooltip from "./_Tooltip";
import Panel from "./_Panel";
import ActivityPanel from "./_ActivityPanel";
import StatePanel from "./_StatePanel";
import FilterPanel from "./_FilterPanel";
import AppliedFilters from "./_AppliedFilters";
import ZoomBttns from "./_ZoomBttns";
import Legend from "./_Legend";

export default function Map({ statesGeo = {}, pointsGeo = {}, filtersSchema = {}, activitySchema = {} }) {
	const [mapSizes, setMapSizes] = useState({});
	const [mapTransform, setMapTransform] = useState({ k:1, x:0, y:0 });
	const [pointData, setPointData] = useState(null);
	const [stateData, setStateData] = useState(null);
	const [activeCount, setActiveCount] = useState(pointsGeo.features.length);
	const [hoveredFeature, setHoveredFeature] = useState(null);
	const [activeActivity, setActiveActivity] = useState(null);
	const [activeState, setActiveState] = useState(null);
	const [activeFilters, setActiveFilters] = useState({});
	const [filterOpen, setFilterOpen] = useState(true);
	const mapRef = useRef({});
	const svgRef = useRef({});

	const MIN_ZOOM = .8;
	const MAX_ZOOM = 4;
	const STROKE_WIDTH = 1;
	const CIRCLE_RADIUS = 5;
	const MARKER_SIZE = 15;

	let projection, geoPath;

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		svg.classed("ready", false);
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		if(!Object.keys(mapSizes).length) return;
		if(svgRef.current.classList.contains("ready")) return;
		setUpMap();
		addStates();
		addMarkers();
	}, [mapSizes]);

	useEffect(() => {
		filterMap();
		onResize();
	}, [activeFilters]);

	const onResize = () => {
		const mapStyle = getComputedStyle(mapRef.current);
		let width = parseFloat(mapStyle.width);
		let height = parseFloat(mapStyle.height);

		if(Object.keys(activeFilters).length) {
			height -= parseFloat(mapStyle.marginTop);
		}

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
		g.selectAll(".markers path")
			// .attr("width", MARKER_SIZE / transform.k)
			// .attr("height", MARKER_SIZE / transform.k)
			.attr("transform", (d) => `translate(${projection(d.geometry.coordinates)}) scale(${1/transform.k})`)
			.attr("style", `filter: drop-shadow(0px 2px 1px rgba(0,0,0,.4))`);
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
		svg.classed("ready", true);
	};

	const addStates = () => {
		const scaleMax = statesGeo.features.reduce((a, b) => b.properties.activities.length > a ? b.properties.activities.length : a, 0);
		const colorRange = ["#B4B4B4", "#F9F9F9"];
		const stateColor = d3.scaleLinear()
			.domain([0, scaleMax])
			.interpolate(d3.interpolateHcl)
			.range([d3.hcl(colorRange[1]), d3.hcl(colorRange[0])]);

		const states = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "states")
			.selectAll("path")
				.data(statesGeo.features)
				.attr("stroke-width", `${STROKE_WIDTH}px`)
			.enter().append("path")
				.attr("stroke", "black")
				.attr("fill", d => stateColor(d.properties.activities.length))
				// .attr("fill", d => d3.interpolateGreys(d.properties.activities.length))
				.attr("d", geoPath)
				.attr("cursor", "pointer")
				.on("click", clickState)
				.on("dblclick", (e) => e.stopPropagation());;
	};


	const addMarkers = () => {
		const authTypes = [...new Set(pointsGeo.features.reduce((a, b) => [...a, b.properties["Authority Type"]], []))];
		const points = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "markers")
			.selectAll("path")
				.data(pointsGeo.features)
			.enter().append("path")
				// .attr("xlink:href", d => `${pointIcon(d.properties["Level"])}.svg`)
				// .attr("xlink:href", d => `${d.properties["Level"]}.svg`)
				// .attr("d", "M6 1L12 11H0L6 1Z")
				.attr("d", d => {
					const SIZE = 8;
					if(d.properties["Level"] === "LocalOth") return `M${SIZE} 1L${SIZE*2} 15H0L${SIZE} 1Z`;
					if(d.properties["Level"] === "LocalSch") return `M 0, ${SIZE} a ${SIZE},${SIZE} 0 1,0 ${SIZE * 2},0 a ${SIZE},${SIZE} 0 1,0 -${SIZE * 2},0`;
				// 	return d3.symbol().type(d3.symbolTriangle).size(MARKER_SIZE);
				})
				.attr("transform", d => `translate(${projection(d.geometry.coordinates)})`)
				// .attr("width", `${MARKER_SIZE}px`)
				// .attr("height", `${MARKER_SIZE}px`)
				.attr("cursor", "pointer")
				// .attr("filter", "url(#drop-shadow)")
				.attr("fill", d => d.properties["Summary Status"] === "Enacted" ? "#999" : "#ccc")
				.attr("style", "filter: drop-shadow(0px 2px 1px rgba(0,0,0,.4))")
				.on("mouseover", hoverPoint)
				.on("mouseout", unhoverPoint)
				.on("click", clickMarker)
				.on("dblclick", (e) => e.stopPropagation());
	};

	const clickState = (e, d) => {
		setActiveActivity(null);
		setActiveState(d.properties);
	}

	const clickMarker = (e, d) => {
		setActiveState(null);
		setActiveActivity(d.properties);
	}

	const hoverPoint = (e, d) => {
		const g = d3.select(svgRef.current).select("g");
		const coords = projection(d.geometry.coordinates);
		// const { k, x, y } = mapTransform;
		// if(transform) {
		// 	pos[0] *= k;
		// 	pos[1] *= k;
		// 	pos[0] += x;
		// 	pos[1] += y;
		// } 
		setHoveredFeature({ ...d.properties, coords: coords });
	}

	const unhoverPoint = (e, d) => {
		if(!d3.select(svgRef.current).classed("moving")) setHoveredFeature(null);
	}

	const onFilterPanelClose = () => {
		setFilterOpen(false);
	};

	const onActivityPanelClose = () => {
		setActiveActivity(null);
	};

	const onStatePanelClose = () => {
		setActiveState(null);
	};

	const onFilterChange = (activeFilters) => {
		setActiveFilters(activeFilters);
		d3.select(svgRef.current).classed("mt-16", Object.keys(activeFilters).length);
	};

	const onZoomClick = (e) => {
		const zoomLevel = e.target.innerText === "+" ? 1.3 : 0.7;
		d3.select(svgRef.current).transition()
			.delay(0)
			.duration(300)
			.call(zoom.scaleBy, zoomLevel);
	};

	const filterMap = () => {
		let count = 0;
		d3.select(svgRef.current).selectAll(".markers path").attr("opacity", (d, i) => {
			const activeGroups = Object.keys(activeFilters).filter((groupKey) => activeFilters[groupKey].length)
			const activeOptions = activeGroups.filter((groupKey) => activeFilters[groupKey].includes(d.properties[groupKey]));
			return activeGroups.length > activeOptions.length ? 0 : 1;
		});
	};

	return (
		<>
			<Helmet>
				<body className="overflow-hidden" />
			</Helmet>
			<div ref={mapRef}
				className={`w-full h-full relative ${Object.keys(activeFilters).length ? "mt-16" : ""}`}>

				<svg ref={svgRef}
					width={mapSizes.width}
					height={mapSizes.height} />

				<ZoomBttns
					onZoomClick={onZoomClick} />

				<AppliedFilters
					activeFilters={activeFilters}
					onFilterChange={onFilterChange} />			

				{filterOpen ?
					<Panel
						onClosePanel={onFilterPanelClose}>
						<FilterPanel
							activeCount={activeCount}
							filtersSchema={filtersSchema}
							activeFilters={activeFilters}
							onFilterChange={onFilterChange} />
					</Panel>
				: <button
						className="absolute top-4 left-4 px-2 py-1 border rounded"
						onClick={() => setFilterOpen(true)}>
						Show filters
					</button>}
				
				{activeActivity ?
					<Panel
						onClosePanel={onActivityPanelClose}>
						<ActivityPanel
							activitySchema={activitySchema}
							activity={activeActivity} />
					</Panel>
				: null}

				{activeState ?
					<Panel
						onClosePanel={onStatePanelClose}>
						<StatePanel
							activitySchema={activitySchema}
							state={activeState} />
					</Panel>
				: null}

				{hoveredFeature ?
					<Tooltip
						data={hoveredFeature}
						transform={mapTransform} />
				: null}

				<Legend
					levelSchema={filtersSchema["Level"]} />

			</div>
		</>
	)
}