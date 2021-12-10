const Papa = require("papaparse");
const neatCsv = require("neat-csv");
const topojson = require("topojson-client");
const slug = require("slug");
const fs = require("fs");

let d3;
let stateCodes;
let actions;

(async () => {
  //GET D3
  d3 = await import("d3");
})().then(async () => {
  //GET ANSI
  const stateCodesCSV = fs.readFileSync("./data/ANSI_State_Codes.csv", {
    encoding: "utf8",
    flag: "r",
  });
  stateCodes = (await neatCsv(stateCodesCSV)).reduce((obj, row) => ({ ...obj, [row.id]: row.code}), {});
}).then(async () => {
  //GET ACTIONS
  const actionsCSV = fs.readFileSync("./data/CRS_Test_Data.csv", {
    encoding: "utf8",
    flag: "r",
  });
  actions = await neatCsv(actionsCSV);
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
    features: topojson.feature(countryTopo, countryTopo.objects.states).features.map((d) => {
      const { [d.id]: state } = stateCodes;
      return({
        type: "Feature",
        properties: {
          state: state,
          actions: actions.filter((a) => !a["County"] && a["State/US"] === state)
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
      .filter((row) => row["Coordinates"])
      .map((d) => {
        const coords = d["Coordinates"].split(",");
        return({
          type: "Feature",
          properties: d,
          geometry: {
            type: "Point",
            coordinates: [Number(coords[1]), Number(coords[0])]
          }
        });
      })
  };
  fs.writeFileSync("./pages/data/conus.js", `export default ${JSON.stringify(conus)}`);
  fs.writeFileSync("./pages/data/states.js", `export default ${JSON.stringify(states)}`);
  fs.writeFileSync("./pages/data/points.js", `export default ${JSON.stringify(points)}`);
});
