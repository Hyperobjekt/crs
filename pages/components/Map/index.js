import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import Panel from "./_Panel";
import DataPanel from "./_DataPanel";
import FilterPanel from "./_FilterPanel";

export default function Map({ statesGeo, pointsGeo, filtersSchema }) {
	const [mapSizes, setMapSizes] = useState({});
	const [pointData, setPointData] = useState(null);
	const [stateData, setStateData] = useState(null);
	const [activeFeature, setActiveFeature] = useState(null);
	const [activeFilters, setActiveFilters] = useState({});
	const [filterOpen, setFilterOpen] = useState(true);
	const mapRef = useRef({});
	const svgRef = useRef({});

	const MIN_ZOOM = .8;
	const MAX_ZOOM = 4;
	const STROKE_WIDTH = 1;
	const CIRCLE_RADIUS = 5;
	const IMAGE_SIZE = 15;

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
		addPoints();
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

	const zoom = d3.zoom()
		.scaleExtent([MIN_ZOOM, MAX_ZOOM])
		.on("zoom", (e) => {
			zoomed(e)
		});

	const zoomed = (e) => {
		let g = d3.select(svgRef.current).select("g");
		const { transform } = e;
		g.attr("transform", transform);
		g.attr("stroke-width", STROKE_WIDTH / transform.k);
		g.selectAll("image")
			.attr("width", IMAGE_SIZE / transform.k)
			.attr("height", IMAGE_SIZE / transform.k)
			.attr("style", `filter: drop-shadow(0px 2px 1px rgba(0,0,0,.4))`)
	};

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
		const scaleMax = statesGeo.features.reduce((a, b) => b.properties.actions.length > a ? b.properties.actions.length : a, 0);
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
				.attr("fill", d => stateColor(d.properties.actions.length))
				// .attr("fill", d => d3.interpolateGreys(d.properties.actions.length))
				.attr("d", geoPath)
				.attr("cursor", "pointer")
				.on("click", clickState)
				.on("dblclick", (e) => e.stopPropagation());;
	};

	const addPoints = () => {
		const authTypes = [...new Set(pointsGeo.features.reduce((a, b) => [...a, b.properties["Authority Type"]], []))];
		// const pointIcon = d3.scaleOrdinal()
		// 	.domain(authTypes)
		// 	.range(["icon-1", "icon-2"]);

		// const defs = d3.select(svgRef.current).append("defs");

		// const shadow = defs.append("filter")
		// 	.attr("id", "drop-shadow")
		// 	.attr("width", "130%")
		// 	.attr("height", "150%");

		// shadow.append("feGaussianBlur")
		// 	.attr("in", "SourceAlpha")
		// 	.attr("stdDeviation", 1)
		// 	.attr("result", "blur");

		// shadow.append("feOffset")
			// .attr("in", "blur")
			// .attr("dx", 0)
			// .attr("dy", 5)
			// .attr("result", "offsetBlur");

		// shadow.append("feFlood")
	 //    .attr("in", "offsetBlur")
	 //    .attr("flood-color", "#ffffff")
	 //    .attr("flood-opacity", ".5")
	 //    .attr("result", "offsetColor");

		// var feMerge = shadow.append("feMerge");

		// feMerge.append("feMergeNode")
		// 	.attr("in", "offsetBlur")
		// // feMerge.append("feMergeNode")
		// // 	.attr("in", "offsetColor")
		// feMerge.append("feMergeNode")
		// 	.attr("in", "SourceGraphic");
		;
		const points = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "markers")
			.selectAll("path")
				.data(pointsGeo.features)
			.enter().append("image")
				// .attr("xlink:href", d => `${pointIcon(d.properties["Level"])}.svg`)
				.attr("xlink:href", d => `${d.properties["Level"]}.svg`)
				.attr("x", function(d) {
					return projection(d.geometry.coordinates)[0];
				})
				.attr("y", function(d) {
					return projection(d.geometry.coordinates)[1];
				})
				.attr("width", `${IMAGE_SIZE}px`)
				.attr("height", `${IMAGE_SIZE}px`)
				.attr("cursor", "pointer")
				// .attr("filter", "url(#drop-shadow)")
				.attr("style", "filter: drop-shadow(0px 2px 1px rgba(0,0,0,.4))")
				.on("click", clickPoint)
				.on("dblclick", (e) => e.stopPropagation());
	};

	const clickState = (e, d) => {
		setActiveFeature({ ...d.properties, timestamp: e.timeStamp });
	}

	const clickPoint = (e, d) => {
		setActiveFeature({ ...d.properties, timestamp: e.timeStamp });
	}

	const onFilterPanelClose = () => {
		setFilterOpen(false);
	};

	const onDataPanelClose = () => {
		setActiveFeature(null);
	};

	const onFilterChange = (activeFilters) => {
		setActiveFilters(activeFilters);
		d3.select(svgRef.current).classed("mt-16", Object.keys(activeFilters).length);
	};

	const onClickApplied = (e) => {
		const newActiveFilters = {...activeFilters};
		delete newActiveFilters[e.target.value];
		setActiveFilters(newActiveFilters);
	};

	const onClickClear = () => {
		setActiveFilters({});
	};

	const onZoomClick = (e) => {
		const zoomLevel = e.target.innerText === "+" ? 1.3 : 0.7;
		d3.select(svgRef.current).transition()
			.delay(0)
			.duration(300)
			.call(zoom.scaleBy, zoomLevel);
	};

	const filterMap = () => {
		d3.select(svgRef.current).selectAll(".markers image").attr("opacity", (d, i) => {
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
				id="map"
				className={`w-full h-full relative ${Object.keys(activeFilters).length ? "mt-16" : ""}`}>
				<svg ref={svgRef}
					width={mapSizes.width}
					height={mapSizes.height} />

				<div className="absolute top-4 right-4 flex flex-col border rounded text-center">
					<button
						className="w-7 h-7 text-center border-b"
						onClick={onZoomClick}>
						+
					</button>

					<button
						className="w-7 h-7 text-center"
						onClick={onZoomClick}>
						-
					</button>
				</div>

				{Object.keys(activeFilters).length ?
					<div id="applied-filters"
						className="w-full h-16 absolute left-0 -top-16 z-20 bg-white border-b p-4">
						<span>Applied Fiters:</span>
						{Object.keys(activeFilters).map(key => (
							<button
								key={key}
								value={key}
								className="text-slate-600 bg-slate-200 rounded-full px-4 py-1 mr-2"
								onClick={onClickApplied}>
								{key}: {activeFilters[key].map((o, i) => `${o}${i < activeFilters[key].length - 1 ? ", " : ""}`)}
							</button>
						))}
						<button
							className="px-4 py-1"
							onClick={onClickClear}>
							Clear all
						</button>
					</div>
				: null}

				{filterOpen ?
					<Panel
						onClosePanel={onFilterPanelClose}>
						<FilterPanel
							filtersSchema={filtersSchema}
							activeFilters={activeFilters}
							onFilterChange={onFilterChange} />
					</Panel>
				: <button
						className="absolute top-4 left-4 px-2 py-1 border rounded"
						onClick={() => setFilterOpen(true)}>
						Show filters
					</button>}
				
				{activeFeature ?
					<Panel
						onClosePanel={onDataPanelClose}>
						<DataPanel
							activeFeature={activeFeature} />
					</Panel>
				: null}
			</div>
		</>
	)
}