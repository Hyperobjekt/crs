require("dotenv").config();
const Papa = require("papaparse");
const neatCsv = require("neat-csv");
const topojson = require("topojson-client");
const fs = require("fs");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const isDry = process.argv.indexOf("--dry") > -1;
const isNoApi = process.argv.indexOf("--no-api") > -1;

let d3, fetchJson, stateCodes, activities;

(async () => {
	//GET D3
	d3 = await import("d3");
})().then(async () => {
	//GET ANSI
	const stateCodesCsv = fs.readFileSync("./data/raw/ANSI_State_Codes.csv", {
		encoding: "utf8",
		flag: "r",
	});
	stateCodes = (await neatCsv(stateCodesCsv)).reduce((obj, row) => ({ ...obj, [row.id]: row.code}), {});
}).then(async () => {
	//GET ACTIVITIES
	const activitiesCsv = fs.readFileSync("./data/raw/CRS_Test_Data.csv", {
		encoding: "utf8",
		flag: "r",
	});
	activities = await neatCsv(activitiesCsv);
}).then(async () => {
	activities = activities.map(row => {
		
		Object.keys(row).forEach((key) => {
			const val = row[key];
			let newVal = val.trim();
			if(key === "Date Intro") {
				newVal = new Date(val).toJSON();	
			}
			row[key] = newVal;
		});
		return row;
	});
}).then(async () => {
	//GET COORDINATES
	if(isNoApi) return;
	const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
	const endpoint = "mapbox.places";
	activities = await Promise.all(activities.map(async (row) => {
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
	const countryStr = fs.readFileSync("./data/raw/US_Shapes.json", {
		encoding: "utf8",
		flag: "r",
	});
	const countryTopo = JSON.parse(countryStr);
	//HANDLE CONUS
	// const conus = topojson.feature(countryTopo, {
	// 	type: "GeometryCollection",
	// 	geometries: countryTopo.objects.states.geometries.filter(function(d) {
	// 		return d.id !== 2 // AK
	// 			&& d.id !== 15 // HI
	// 			&& d.id < 60; // outlying areas
	// 	})
	// });
	//HANDLE STATE ACTIVITIES
	const states = {
		type: "FeatureCollection",
		name: "states",
		features: topojson.feature(countryTopo, countryTopo.objects.states).features.map((d, i) => {
			const { [d.id]: state } = stateCodes;
			return({
				type: "Feature",
				properties: {
					state: state,
					activities: activities.filter((row) => row["Level"] === "State" && row["State/US"] === state),
					index: i
				},
				geometry: d.geometry
			});
		})
	};
	//HANDLE LOCAL ACTIVITIES
	const points = {
		type: "FeatureCollection",
		name: "local",
		features: activities
			.filter((row) => row["Level"] && row["Level"].indexOf("Local") > -1)
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
	//HANDLE TABLE DATA
	// const table = activities
	// 	.filter(row => row["Level"])
	// 	.reduce((obj, row) => {
	// 	const level = row["Level"].indexOf("Local") > -1 ? "Local" : row["Level"];
	// 	obj[level] = obj[level] ? obj[level] : [];
	// 	obj[level].push(row);
	// 	return obj;
	// }, {});
	const table = activities.map((a, i) => ({ ...a, id: i }));

	if(isDry) return;
	// fs.writeFileSync("./data/conus.json", JSON.stringify(conus));
	fs.writeFileSync("./data/states.json", JSON.stringify(states));
	fs.writeFileSync("./data/points.json", JSON.stringify(points));
	fs.writeFileSync("./data/table.json", JSON.stringify({data:table}));
});
