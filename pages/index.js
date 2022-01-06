import { useEffect, useState, useRef } from "react";

import Header from "./components/Header";
import Map from "./components/Map";
import Table from "./components/Table";

import statesGeo from "../data/states";
import pointsGeo from "../data/points";
import tableData from "../data/table";

export const getStaticProps = async () => {
	return {
		props: {
			statesGeo: statesGeo,
			pointsGeo: pointsGeo,
			tableData: tableData.data,
		}
	}
}

export default function Index({ tableData, statesGeo, pointsGeo }) {
	const [activeView, setActiveView] = useState("map");

	const onViewClick = (e) => {
		console.log(e);
		setActiveView(e.target.value);
	};

	return(
		<div
			id="page"
			className="w-screen h-screen flex flex-col">

			<Header activeView={activeView} onViewClick={onViewClick} />

			<main
				className="flex-1"
				style={{
					// overflow: activeView === "map" ? "hidden" : null,
					overflow: "hidden",
					height: activeView === "table" ? "100%" : null,
				}}>
				{activeView === "map" ? <Map statesGeo={statesGeo} pointsGeo={pointsGeo} /> : null}
				{activeView === "table" ? <Table tableData={tableData} /> : null}
			</main>
		</div>
	);
}
