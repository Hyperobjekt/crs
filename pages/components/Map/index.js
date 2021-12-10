import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import statesGeo from "../../data/states";
import pointsGeo from "../../data/points";
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
		addPoints();
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
		const scaleMax = statesGeo.features.reduce((a, b) => b.properties.actions.length > a ? b.properties.actions.length : a, 0);
		const scheme = "Oranges";
		const color = d3.scaleQuantize([0, scaleMax], d3[`scheme${scheme}`][7]);
		const states = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "states")
			.selectAll("path")
				.data(statesGeo.features)
				.attr("stroke-width", `${STROKE_WIDTH}px`)
			.enter().append("path")
				.attr("stroke", "black")
				.attr("fill", d => color(d.properties.actions.length))
				.attr("d", geoPath);
	}

	function addPoints() {
		const points = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "markers")
			.selectAll("circle")
				.data(pointsGeo.features)
			.enter().append("circle")
				.attr("cx", function(d) {
					return projection(d.geometry.coordinates)[0];
				})
				.attr("cy", function(d) {
					return projection(d.geometry.coordinates)[1];
				})
				.attr("r", `${CIRCLE_RADIUS}px`)
				.attr("fill", "black");
	}

	return (
		<svg id="map"
				 ref={svgRef}
				 width={winSizes.width}
				 height={winSizes.height} />
	)
}