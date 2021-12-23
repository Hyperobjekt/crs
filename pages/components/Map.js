import { useEffect, useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import * as d3 from "d3";
import * as topojson from "topojson-client";

import Filter from "./Filter";
import Panel from "./Panel";

export default function Map({ filterData, statesGeo, pointsGeo }) {
	const [mapSizes, setMapSizes] = useState({});
	const [pointData, setPointData] = useState(null);
	const [stateData, setStateData] = useState(null);
	const [activeFeature, setActiveFeature] = useState(null);
	const mapRef = useRef({});
	const svgRef = useRef({});

	const STROKE_WIDTH = 1;
	const CIRCLE_RADIUS = 5;
	const IMAGE_SIZE = 15;

	let projection, geoPath;

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();
		svg.classed("ready", false);
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener('resize', onResize);
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
	}, [filterData]);

	const onResize = () => {
		const { width, height } = mapRef.current.getBoundingClientRect();
		setMapSizes({
			width: width,
			height: height,
		});
	}

	const zoom = d3.zoom()
		.scaleExtent([1, 8])
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
		const stateColor = d3.scaleQuantize([0, scaleMax], d3.schemeOranges[7]);
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
				.attr("d", geoPath)
				.attr("cursor", "pointer")
				.on("click", clickState)
				.on('dblclick', (e) => e.stopPropagation());;
	};

	const addPoints = () => {
		const authTypes = [...new Set(pointsGeo.features.reduce((a, b) => [...a, b.properties["Authority Type"]], []))];
		const pointIcon = d3.scaleOrdinal()
			.domain(authTypes)
			.range(["icon-1", "icon-2", "icon-3", "icon-4", "icon-5"])
		const points = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "markers")
			.selectAll("path")
				.data(pointsGeo.features)
			.enter().append("image")
				.attr("xlink:href", d => `${pointIcon(d.properties["Level"])}.png`)
				.attr("x", function(d) {
					return projection(d.geometry.coordinates)[0];
				})
				.attr("y", function(d) {
					return projection(d.geometry.coordinates)[1];
				})
				.attr("width", `${IMAGE_SIZE}px`)
				.attr("height", `${IMAGE_SIZE}px`)
				.attr("cursor", "pointer")
				.on("click", clickPoint)
				.on('dblclick', (e) => e.stopPropagation());
	};

	const clickState = (e, d) => {
		setActiveFeature({ ...d.properties, timestamp: e.timeStamp });
	}

	const clickPoint = (e, d) => {
		setActiveFeature({ ...d.properties, timestamp: e.timeStamp });
	}

	const onPanelChange = (activeFeature) => {
		// setActiveFeature(activeFeature);
	};

	const filterMap = () => {
		d3.select(svgRef.current).selectAll(".markers image").attr("opacity", (d, i) => {
			const activeGroups = Object.keys(filterData).filter((groupKey) => filterData[groupKey].length)
			const activeOptions = activeGroups.filter((groupKey) => filterData[groupKey].includes(d.properties[groupKey]));
			return activeGroups.length > activeOptions.length ? 0 : 1;
		});
	};

	return (
		<>
			<Helmet>
				<body style="overflow: hidden" />
			</Helmet>
			{/*<Filter
				onFilterChange={onFilterChange} />*/}
			<div ref={mapRef}
				id="map"
				style={{ width: "100%", height: "100%" }}>
				<svg ref={svgRef}
						 width={mapSizes.width}
						 height={mapSizes.height} />
				<Panel
					activeFeature={activeFeature}
					onPanelChange={onPanelChange}
					/>
			</div>
		</>
	)
}