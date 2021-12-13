require("dotenv").config();
const Papa = require("papaparse");
const neatCsv = require("neat-csv");
const topojson = require("topojson-client");
const fs = require("fs");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const isDry = process.argv.indexOf("--dry") > -1;
const isNoApi = process.argv.indexOf("--no-api") > -1;

let d3, fetchJson, stateCodes, actions;

(async () => {
	//GET D3
	d3 = await import("d3");
})().then(async () => {
	//GET ANSI
	const stateCodesCsv = fs.readFileSync("./data/ANSI_State_Codes.csv", {
		encoding: "utf8",
		flag: "r",
	});
	stateCodes = (await neatCsv(stateCodesCsv)).reduce((obj, row) => ({ ...obj, [row.id]: row.code}), {});
}).then(async () => {
	//GET ACTIONS
	const actionsCsv = fs.readFileSync("./data/CRS_Test_Data.csv", {
		encoding: "utf8",
		flag: "r",
	});
	actions = await neatCsv(actionsCsv);
}).then(async () => {
	//GET COORDINATES
	if(isNoApi) return;
	const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
	const endpoint = "mapbox.places";
	actions = await Promise.all(actions.map(async (row) => {
		if(!row["Address"]) return row;
		const search_text = encodeURIComponent(row["Address"]);
		const url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?limit=1&access_token=${accessToken}`;
		const res = await fetch(url)
			.then(response => response.json())
		  .then(resJson => {
		  	return resJson.features ? { ...row, geometry: resJson.features[0].geometry } : row;
		  });
		return await res;
	}));
}).then(async () => {
	//GET STATES
	const countryStr = fs.readFileSync("./data/US_Shapes.json", {
		encoding: "utf8",
		flag: "r",
	});
	const countryTopo = JSON.parse(countryStr);
	//HANDLE CONUS
	const conus = topojson.feature(countryTopo, {
		type: "GeometryCollection",
		geometries: countryTopo.objects.states.geometries.filter(function(d) {
			return d.id !== 2 // AK
				&& d.id !== 15 // HI
				&& d.id < 60; // outlying areas
		})
	});
	//HANDLE STATE ACTIONS
	const states = {
		type: "FeatureCollection",
		name: "states",
		features: topojson.feature(countryTopo, countryTopo.objects.states).features.map(d => {
			const { [d.id]: state } = stateCodes;
			return({
				type: "Feature",
				properties: {
					state: state,
					actions: actions.filter((row) => row["Level"] === "State" && row["State/US"] === state)
				},
				geometry: d.geometry
			});
		})
	};
	//HANDLE LOCAL ACTIONS
	const points = {
		type: "FeatureCollection",
		name: "local",
		features: actions
			.filter((row) => row["geometry"])
			.map((row, i) => {
				const { geometry } = row;
				delete row.geometry;
				return({
					type: "Feature",
					properties: { ...row, index: i },
					geometry: geometry
				});
			})
	};

	if(isDry) return;
	fs.writeFileSync("./pages/data/conus.js", `export default ${JSON.stringify(conus)}`);
	fs.writeFileSync("./pages/data/states.js", `export default ${JSON.stringify(states)}`);
	fs.writeFileSync("./pages/data/points.js", `export default ${JSON.stringify(points)}`);
});
