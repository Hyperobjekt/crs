import { useEffect, useState, useRef } from "react";

import Map from "./components/Map";
import Table from "./components/Table";

export default function Home() {
	const [activeView, setActiveView] = useState("map");

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
	}

	return(
		<div id="page">

			<form style={{ padding: "20px 20px 0 20px" }}>
				{views.map(viewToggleElem)}
			</form>

			<main>
				{activeView === "map" ? <Map /> : null}
				{activeView === "table" ? <Table /> : null}
			</main>
		</div>
	);
}
