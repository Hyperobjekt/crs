import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import statesGeo from "../../data/states";
import conusGeo from "../../data/conus";

export default function Map() {
	const [winSizes, setWinSizes] = useState({});
	const svgRef = useRef(null);

	const STROKE_WIDTH = 1;
	const CIRCLE_RADIUS = 5;

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
		if(!Object.keys(winSizes).length) return;
		if(svgRef.current.classList.contains("ready")) return;
		setUpMap();
		addStates();
	}, [winSizes]);

	function onResize() {
		const { innerWidth, innerHeight } = window;
		setWinSizes({
			width: innerWidth,
			height: innerHeight
		});
	}

	const zoom = d3.zoom()
		.scaleExtent([1, 8])
		.on("zoom", (e) => {
			zoomed(e, svgRef.current, STROKE_WIDTH, CIRCLE_RADIUS)
		});

	function zoomed(e, svg, strokeWidth, circleRadius) {
		let g = d3.select(svg).select("g");
		const { transform } = e;
		g.attr("transform", transform);
		g.attr("stroke-width", strokeWidth / transform.k);
		g.selectAll("circle").attr("r", circleRadius / transform.k);
	}

	function setUpMap () {
		const svg = d3.select(svgRef.current),
					svgWidth = +svg.attr("width"),
					svgHeight = +svg.attr("height");
		projection = d3.geoMercator().fitSize([svgWidth, svgHeight], conusGeo);
		svg.append("g");
		geoPath = d3.geoPath()
			.projection(projection);
		svg.call(zoom);
		svg.classed("ready", true);
	}

	function addStates() {
		const scaleMin = 0;
		const states = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "states")
			.selectAll("path")
				.data(statesGeo.features)
				.attr("stroke-width", `${STROKE_WIDTH}px`)
			.enter().append("path")
				.attr("stroke", "black")
				.attr("fill", "white")
				.attr("d", geoPath);
	}

	return (
		<svg id="map"
				 ref={svgRef}
				 width={winSizes.width}
				 height={winSizes.height} />
	)
}