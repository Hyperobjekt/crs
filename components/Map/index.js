import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import VARS from "../../vars";
import Legend from "./_Legend";
import TooltipMap from "./_TooltipMap";
import ZoomBttns from "./_ZoomBttns";

export default function Map({
	statesGeo = {},
	localsGeo = {},
	filteredActivities = [],
	activeActivity,
	activeState,
	setActiveActivity,
	setActiveState,
}) {
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

	let projection = d3.geoAlbersUsa();
	let geoPath;

	useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll("g").remove();
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
		addFederal();
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
			.attr("stroke-width", VARS.STROKE_WIDTH_DEFAULT / mapTransform.k)
		svg.classed("moving", true);
		setHoveredFeature(null);
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
				.attr("d", d => VARS.SHAPES[d.properties.level])
				.attr("fill", d => d.properties.progress === "Enacted" ? VARS.LOCAL_COLORS[d.properties.level][0] : `url(#pattern-${d.properties.level})`)
				// .attr("fill", d => d.properties.progress === "Enacted" ? VARS.LOCAL_COLORS[d.properties.level][0] : `transparent`)
				.attr("stroke-width", VARS.STROKE_WIDTH_DEFAULT)
				.attr("stroke", d => VARS.LOCAL_COLORS[d.properties.level][1])
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
					.attr("class", "states");

		const stateShapes = d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "state-shapes")
					.append("g")
			.selectAll("path")
				.data(statesGeo.features)
				.attr("stroke-width", VARS.STROKE_WIDTH_DEFAULT)
			.enter().append("path")
				.attr("stroke", VARS.STROKE_COLOR_DEFAULT)
				.attr("d", geoPath)
				.attr("cursor", "pointer")
				.on("mouseover", onHoverFeature)
				.on("mouseout", onUnhoverFeature)
				.on("click", onClickFeature)
				.on("dblclick", (e) => e.stopPropagation());
			

		const pathRenderer = d3.geoPath().projection(projection);
		// const centroids = [];
		// statesGeo.features.forEach(d => {
		// 	if(d.properties.state) {
		// 	 centroids.push([d.properties.state, pathRenderer.centroid(d)[0], pathRenderer.centroid(d)[1]]);
		// 	}
		// });
		// console.log(JSON.stringify(centroids));
		
		// const stateLabels = d3.select(svgRef.current)
		// 	.select("g")
		// 		.append("g")
		// 			.attr("class", "state-labels")
		// 			.attr("pointer-events", "none")
		// 			.append("g")
		// 	.selectAll("text")
		//     .data(statesGeo.features)
		//     .join("text")
		//       .attr("text-anchor", "middle")
		//       .attr("font-size", 10)
		//       .attr("fill", d => d.properties.state !== "HI" ? VARS.STROKE_COLOR_DEFAULT : "white")
		//       .text(d => d.properties.state !== "US" ? d.properties.state : "")
		//       .attr("x", d => d.properties.state ? pathRenderer.centroid(d)[0] : null)
		//       .attr("y", d => d.properties.state ? pathRenderer.centroid(d)[1] : null);
	};

	const addFederal = () => {
		const dcGeo = statesGeo.features.filter(d => d.properties.state === "US");
		const dcCoords = dcGeo[0].geometry.coordinates[0][0][4];

		d3.select(svgRef.current)
			.select("g")
				.append("g")
					.attr("class", "federal");

		const dcLine = d3.select(svgRef.current)
			.select("g.federal")
			.append("line")
				.attr("class", "federal-line")
				.attr("stroke-width", VARS.STROKE_WIDTH_DEFAULT)
				.attr("stroke", VARS.STROKE_COLOR_DEFAULT)
				.attr("x1", projection(dcCoords)[0])
				.attr("y1", projection(dcCoords)[1])
				.attr("x2", projection(dcCoords)[0] + VARS.DC_OFFSET_X)
				.attr("y2", projection(dcCoords)[1] + VARS.DC_OFFSET_Y);
	
		const dcMarker = d3.select(svgRef.current)
			.select("g.federal")
			.selectAll("path")
				.data(dcGeo)
			.enter().append("g")
				.attr("class", "federal-icon")
				.attr("transform", d => `translate(${[
					projection(dcCoords)[0] + VARS.DC_OFFSET_X,
					projection(dcCoords)[1] + VARS.DC_OFFSET_Y
				]})`);

		dcMarker
			.append("g")
			.append("rect")
			.attr("fill", "#E6F0F3")
			.attr("stroke", VARS.STROKE_COLOR_DEFAULT)
			.attr("stroke-width", VARS.STROKE_WIDTH_DEFAULT)
			.attr("rx", 6)
			.attr("ry", 6)
			.attr("transform", d => `translate(${-VARS.DC_SIZE/2}, ${-VARS.DC_SIZE/2})`)
			.attr("width", VARS.DC_SIZE)
			.attr("height", VARS.DC_SIZE)
			.attr("cursor", "pointer")
			.on("mouseover", onHoverFeature)
			.on("mouseout", onUnhoverFeature)
			.on("click", onClickFeature)
			.on("dblclick", (e) => e.stopPropagation());

		dcMarker
			.append("image")
			.attr("xlink:href", d => "IconFederal.svg")
			.attr("width", `${VARS.DC_SIZE * .75}px`)
			.attr("height", `${VARS.DC_SIZE * .75}px`)
			.attr("transform", d => `translate(${-VARS.DC_SIZE/2 * .75}, ${-VARS.DC_SIZE/2 * .75})`)
			.attr("pointer-events", "none");
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
					states = d3.select(svgRef.current).selectAll(".state-shapes path");
		setActiveActivity(null);
		setActiveState(null);
		setActiveState(d.properties);
	}

	const onClickStateFeature = (e, d) => {
		const elem = e.target,
					path = d3.select(elem),
					states = d3.select(svgRef.current).selectAll(".state-shapes path, .federal-icon rect");
		elem.parentElement.appendChild(elem);
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
			data = { ...d.properties, tallies: {} };
			const stateActivities = filteredActivities.filter(a => a.state === data.state && ["State", "Federal"].includes(a.level));
			stateActivities.forEach(a => {
				const { type, progress } = a;
				if(!data.tallies[progress]) data.tallies[progress] = {};
				data.tallies[progress][type] = data.tallies[progress][type] ? data.tallies[progress][type] + 1 : 1;
			});
			if(d.properties.state !== "US") {
				const stateCentroid = d3.geoCentroid(d.geometry),
							stateBounds = d3.geoBounds(d.geometry);
				coords = [
					projection(stateCentroid)[0],
					projection(stateBounds[0])[1]
				];
				const activeState = parent.select(`path[stroke="${VARS.STROKE_COLOR_ACTIVE}"]`);
				if(activeState.empty()) {
					parent.node().appendChild(elem);
				} else {
					parent.node().insertBefore(elem, activeState.node());
				}
			}
			if(d.properties.state === "US") {
				const dcCoords = d.geometry.coordinates[0][0][4];
				coords = [
					projection(dcCoords)[0] + VARS.DC_OFFSET_X,
					projection(dcCoords)[1] + VARS.DC_OFFSET_Y
				];
				offsetY = VARS.DC_SIZE / 2 + 15;
			}
		}

		if(d.properties.type === "local") {
			coords = translateLocal(d);
			data = filteredActivities.find(a => a.index === d.properties.index)
			offsetX = VARS.MARKER_SIZE / 2;
			offsetY = VARS.MARKER_SIZE / 2 * 4;
		}

		if(coords) setHoveredFeature({ ...data, coords, offset: [offsetX, offsetY] });
	}

	const onUnhoverFeature = (e, d) => {
		if(d3.select(svgRef.current).classed("moving")) return;
		setHoveredFeature(null);
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
		.scaleExtent([VARS.MIN_ZOOM, VARS.MAX_ZOOM])
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
		return projection(d.geometry.coordinates).map(l => l - VARS.MARKER_SIZE / 4);
	}

	const updateMapStyle = () => {
		const svg = d3.select(svgRef.current);
		svg.selectAll(".local path")
			.attr("visibility", d => filteredIndices.includes(d.properties.index) ? "visisble" : "hidden")
			.attr("stroke-width", d => {
				const isHovered = hoveredFeature && hoveredFeature.index === d.properties.index;
				const isActive = activeActivity && activeActivity.index === d.properties.index;
				const strokeWidth = isActive ? VARS.STROKE_WIDTH_ACTIVE : isHovered ? VARS.STROKE_WIDTH_ACTIVE * .75 : VARS.STROKE_WIDTH_DEFAULT;
				return strokeWidth;
			});

		svg.selectAll(".state-shapes path")
			.attr("fill", d => {
				const stateActivities = filteredActivities.filter(a => a.level === "State" && a.state === d.properties.state);
				if(!stateActivities.length) return VARS.STATE_COLORS[0];
				if(stateActivities.filter(d => d.progress === "Enacted").length) return VARS.STATE_COLORS[2];
				return VARS.STATE_COLORS[1];
			})
			.attr("stroke-width", d => {
				const isHovered = hoveredFeature && hoveredFeature.index === d.properties.index;
				const isActive = activeState && activeState.index === d.properties.index;
				const strokeWidth = isHovered || isActive ? VARS.STROKE_WIDTH_ACTIVE : VARS.STROKE_WIDTH_DEFAULT;
				return strokeWidth / mapTransform.k;
			})
			.attr("stroke", d => {
				return d.properties.index === (activeState ? activeState.index : null)
					? VARS.STROKE_COLOR_ACTIVE
					: VARS.STROKE_COLOR_DEFAULT
			});

		svg.select(".federal-icon rect")
			.attr("fill", d => {
				const federalActivities = filteredActivities.filter(a => a.level === "Federal" && a.state === d.properties.state);
				if(!federalActivities.length) return VARS.STATE_COLORS[0];
				if(federalActivities.filter(d => d.progress === "Enacted").length) return VARS.STATE_COLORS[2];
				return VARS.STATE_COLORS[1];
			})
			.attr("stroke-width", d => {
				const isHovered = hoveredFeature && hoveredFeature.index === d.properties.index;
				const isActive = activeState && activeState.index === d.properties.index;
				const strokeWidth = isHovered || isActive ? VARS.STROKE_WIDTH_ACTIVE : VARS.STROKE_WIDTH_DEFAULT;
				return strokeWidth;
			})
			.attr("stroke", d => {
				return d.properties.index === (activeState ? activeState.index : null)
					? VARS.STROKE_COLOR_ACTIVE
					: VARS.STROKE_COLOR_DEFAULT
			});
	};

	

	return (
		<>
			<Helmet>
				<body className="overflow-hidden" />
			</Helmet>

			<div ref={mapRef}
				className={`w-full h-full relative`}>

				<div className="w-full h-full relative bg-gray-blue-500">
					<svg ref={svgRef}
						width={mapSizes.width}
						height={mapSizes.height}>
						{VARS.LOCAL_PATTERNS}
					</svg>
				</div>

				<ZoomBttns
					onZoomClick={onZoomClick} />

				{hoveredFeature ?
					<TooltipMap
						feature={hoveredFeature}
						transform={mapTransform}
						parentWidth={mapSizes.width} />
				: null}

				<Legend  />

			</div>
		</>
	)
}