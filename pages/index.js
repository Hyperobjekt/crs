import { useEffect, useState, useRef } from "react";

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
			tableData: tableData,
		}
	}
}

export default function Index({ tableData, statesGeo, pointsGeo }) {
	const [activeView, setActiveView] = useState("map");

	const views = ["map", "table"];

	const changeView = (e) => {
		setActiveView(e.target.value);
	};

	const viewToggleElem = (view) => {
		return(
			<span key={view}>
				<input
					type="radio"
					name="view"
					id={view}
					value={view}
					checked={view === activeView}
					onChange={changeView}
					className="m-0 cursor-pointer" />
				<label
					htmlFor={view}
					className="p-1 cursor-pointer" >
					{view.charAt(0).toUpperCase() + view.slice(1)}
				</label>
			</span>
		);
	};

	return(
		<div
			id="page"
			className="w-screen h-screen flex flex-col">

			<header className="relative z-20">
				<form className="border-b p-4">
					{views.map(viewToggleElem)}
				</form>
			</header>

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
