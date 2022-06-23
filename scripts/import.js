require("dotenv").config();
const Papa = require("papaparse");
const neatCsv = require("neat-csv");
const topojson = require("topojson-client");
const fs = require("fs");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const isDry = process.argv.indexOf("--dry") > -1;

let stateCodes, activities;

(async () => {
	//GET ANSI
	const stateCodesCsv = fs.readFileSync("./data/raw/ANSI_State_Codes.csv", {
		encoding: "utf8",
		flag: "r",
	});
	stateCodes = (await neatCsv(stateCodesCsv)).reduce((obj, row) => ({ ...obj, [row.id]: row.code }), {});
})().then(async () => {
	//GET ACTIVITIES
	const activitiesCsv = fs.readFileSync("./data/raw/CRT_Data.csv", {
		encoding: "utf8",
		flag: "r",
	});
	activities = await neatCsv(activitiesCsv);
}).then(async () => {
	activities = activities.map((row, index) => {
		Object.keys(row).forEach(key => {
			const val = row[key];
			let newVal = val.trim();
			if(key === "date_intro") {
				newVal = new Date(val).toJSON();	
			}
			const booleanGroups = {
				"target": ["target_1", "target_2", "target_3", "target_4", "target_5"],
				"prohibited": ["prohibited_1", "prohibited_2", "prohibited_3", "prohibited_4"],
				"required": ["required_1", "required_2", "required_3"],
				"trigger": ["trigger_1", "trigger_2", "trigger_3", "trigger_4", "trigger_5" ,"trigger_6", "trigger_7"],
				"enforcement": ["enforcement_1", "enforcement_2", "enforcement_3"]
			};
			let isBooleanGroup = false;
			Object.keys(booleanGroups).forEach(groupKey => {
				if(booleanGroups[groupKey].includes(key)) {
					if(!row[groupKey]) row[groupKey] = [];
					if(row[key] === "TRUE") row[groupKey].push(key);
					isBooleanGroup = true;
				}
			});
			if(isBooleanGroup) {
				delete row[key];
			} else {
				row[key] = newVal;
			}
		});
		row.index = index;
		return row;
	});
}).then(async () => {
	//GET COORDINATES
	const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
	const endpoint = "mapbox.places";
	activities = await Promise.all(activities.map(async (row) => {
		if(!row.address) return row;
		const search_text = encodeURIComponent(row.address);
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
	//HANDLE STATE ACTIVITIES
	const states = {
		type: "FeatureCollection",
		name: "states",
		features: topojson.feature(countryTopo, countryTopo.objects.states).features.map((d, i) => {
			const { [d.id]: state } = stateCodes;
			return({
				type: "Feature",
				properties: {
					type: "state",
					state: state,
					index: i
				},
				geometry: d.geometry
			});
		})
	};
	// //HANDLE LOCAL ACTIVITIES
	const locals = {
		type: "FeatureCollection",
		name: "local",
		features: activities
			.filter((row) => row.level && row.level.includes("Local"))
			.filter((row) => row.geometry)
			.map((row, i) => {
				const { geometry } = row;
				delete row.geometry;
				return({
					type: "Feature",
					// properties: { ...row, index: i },
					properties: {
						type: "local",
						level: row.level,
						progress: row.progress,
						index: row.index
					},
					geometry: geometry
				});
			})
	};

	if(isDry) return console.log(activities);
	fs.writeFileSync("./data/states.json", JSON.stringify(states));
	fs.writeFileSync("./data/locals.json", JSON.stringify(locals));
	fs.writeFileSync("./data/activities.json", JSON.stringify({activities: activities}));
	console.log(`Imported ${activities.length} activities`);
});
