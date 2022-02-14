import { useEffect, useState, useRef } from "react";

import Header from "./components/Header";
import Map from "./components/Map";
import Table from "./components/Table";

import statesGeo from "../data/states";
import pointsGeo from "../data/points";
import tableData from "../data/table";
import filtersSchema from "../data/filters";
import activitySchema from "../data/activity";

export const getStaticProps = async () => {
	return {
		props: {
			statesGeo: statesGeo,
			pointsGeo: pointsGeo,
			tableData: tableData.data,
			filtersSchema: filtersSchema
		}
	}
}

export default function Index({ statesGeo, pointsGeo, tableData, filtersSchema }) {
	const [activeView, setActiveView] = useState("map");

	const onViewClick = (view) => {
		setActiveView(view);
	};

	return(
		<div
			id="page"
			className="w-screen h-screen flex flex-col">

			<Header activeView={activeView} onViewClick={onViewClick} />

			<main
				className="flex-1"
				style={{
					overflow: "hidden",
					height: activeView === "table" ? "100%" : null,
				}}>

				<div 
					className="w-full h-full"
					style={{ display: activeView === "map" ? "block" : "none" }}>
					<Map
						statesGeo={statesGeo}
						pointsGeo={pointsGeo}
						filtersSchema={filtersSchema}
						activitySchema={activitySchema.fields} />
				</div>

				<div 
					className="w-full h-full"
					style={{ display: activeView === "table" ? "block" : "none" }}>
					<Table tableData={tableData} />
				</div>

			</main>
			
		</div>
	);
}
