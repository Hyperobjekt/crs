import { useEffect, useState, useRef } from "react";

import Map from "./components/Map";
import Table from "./components/Table";
import Filter from "./components/Filter";

export default function Home() {
	const [activeView, setActiveView] = useState("map");
	const [filterData, setFilterData] = useState({});

	const views = ["map", "table"];

	const changeView = (e) => {
		setActiveView(e.target.value);
	};

	const viewToggleElem = (view) => {
		return(
			<span key={view}>
				<input
					style={{ cursor: "pointer", margin: 0 }}
					type="radio"
					name="view"
					id={view}
					value={view}
					checked={view === activeView}
					onChange={changeView} />
				<label
					style={{ cursor: "pointer", padding: 5 }}
					htmlFor={view}>
					{view.charAt(0).toUpperCase() + view.slice(1)}
				</label>
			</span>
		);
	};

	const onFilterChange = (filterData) => {
		setFilterData(filterData);
	};

	return(
		<div id="page" style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>

			<header>
				<form style={{ padding: "20px 20px 0 20px" }}>
					{views.map(viewToggleElem)}
				</form>
				<Filter onFilterChange={onFilterChange} />
			</header>

			<main style={{ overflow: activeView === "map" ? "hidden" : null, flex: 1 }}>
				{activeView === "map" ? <Map filterData={filterData} /> : null}
				{activeView === "table" ? <Table filterData={filterData} /> : null}
			</main>
		</div>
	);
}
