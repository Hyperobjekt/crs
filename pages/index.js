import { useEffect, useState, useRef } from "react";

import Header from "./../components/Header";
import Panel from "./../components/Panel";
import ActivityPanel from "./../components/Panel/_ActivityPanel";
import StatePanel from "./../components/Panel/_StatePanel";
import FilterPanel from "./../components/Panel/_FilterPanel";
import AppliedFilters from "./../components/_AppliedFilters";
import Map from "./../components/Map";
import Table from "./../components/Table";

import statesGeo from "./../data/states";
import pointsGeo from "./../data/points";
import tableData from "../data/table";
import filtersSchema from "./../data/filters";
import activitySchema from "./../data/activity";

export const getStaticProps = async () => {
	return {
		props: {
			statesGeo: statesGeo,
			pointsGeo: pointsGeo,
			tableData: tableData.data,
			filtersSchema: filtersSchema,
			activitySchema: activitySchema,
		}
	}
}

export default function Index({ statesGeo, pointsGeo, tableData, filtersSchema, activitySchema }) {
	const [activeView, setActiveView] = useState("map");
	const [activeActivity, setActiveActivity] = useState(null);
	const [activeState, setActiveState] = useState(null);
	const [activeFilters, setActiveFilters] = useState({});
	const [activeCount, setActiveCount] = useState(pointsGeo.features.length);
	const [filteredData, setFilteredData] = useState(tableData);
	const [hasFilters, setHasFilters] = useState(false);
	const [filterOpen, setFilterOpen] = useState(true);

	useEffect(() => {

		const activeGroups = Object.keys(activeFilters).filter(groupKey => activeFilters[groupKey].length)
		const newFilteredData = tableData.filter(d => {
			return activeGroups.length ?
				activeGroups.filter(groupKey => {
					if(groupKey === "Date Intro") {
						const [start, end] = activeFilters[groupKey];
						if(start && end) return d[groupKey] >= start && d[groupKey] <= end;
						if(start) return d[groupKey] >= start;
						if(end) return d[groupKey] <= end;
					} else if(Array.isArray(d[groupKey])) {
						return activeFilters[groupKey].some(o => (o === "N/A" && !d[groupKey].length) || d[groupKey].includes(o));
					} else {
						return activeFilters[groupKey].includes(d[groupKey]);
					}
				}).length
			: true;
		});
		setFilteredData(newFilteredData);
	}, [activeFilters]);

	useEffect(() => {
		if(activeActivity || activeState) setFilterOpen(false);
	}, [activeState, activeActivity]);

	// const filterTable = (row) => {
	// 	const activeGroups = Object.keys(filterData).filter((groupKey) => filterData[groupKey].length);
	// 	const activeOptions = activeGroups.filter((groupKey) => filterData[groupKey].includes(row[groupKey]));
	// 	return activeGroups.length > activeOptions.length ? 0 : 1;
	// };

	const onViewClick = (view) => {
		setFilterOpen(false);
		setActiveActivity(null);
		setActiveState(null);
		setActiveView(view);
	};

	const onFilterPanelToggle = () => {
		setFilterOpen(!filterOpen);
	};

	const onFilterPanelClose = () => {
		setFilterOpen(false);
	};

	const onActivityPanelClose = () => {
		setActiveActivity(null);
	};

	const onStatePanelClose = () => {
		setActiveState(null);
	};

	const onFilterChange = (activeFilters) => {
		setActiveFilters(activeFilters);
		setHasFilters(Object.keys(activeFilters).length);
	};

	const onClickActivityRow = (activity) => {
		setActiveActivity(activity);
	};

	return(
		<div
			id="page"
			className="w-screen h-screen flex flex-col">

			<Header activeView={activeView} onViewClick={onViewClick} />

			<AppliedFilters
				filterOpen={filterOpen}
				activeFilters={activeFilters}
				onFilterPanelToggle={onFilterPanelToggle}
				onFilterChange={onFilterChange} />	

			<main
				className="flex flex-1 relative"
				style={{
					overflow: "hidden",
					height: activeView === "table" ? "100%" : null,
				}}>

				<div 
					className="w-full flex"
					style={{ display: activeView === "map" ? "block" : "none" }}>
					<Map
						statesGeo={statesGeo}
						pointsGeo={pointsGeo}
						filteredData={filteredData}
						activeFilters={activeFilters}
						setActiveActivity={setActiveActivity}
						setActiveState={setActiveState} />
				</div>

				<div 
					className="w-full h-full"
					style={{ display: activeView === "table" ? "block" : "none" }}>
					<Table
						filteredData={filteredData}
						setActiveActivity={setActiveActivity} />
				</div>

				{filterOpen ?
					<Panel
						zIndex={50}
						onClosePanel={onFilterPanelClose}>
						<FilterPanel
							activeCount={activeCount}
							filtersSchema={filtersSchema}
							activeFilters={activeFilters}
							onFilterChange={onFilterChange} />
					</Panel>
				: null}

				{!filterOpen && activeState && !activeActivity ?
					<Panel
						zIndex={30}
						onClosePanel={onStatePanelClose}>
						<StatePanel
							state={activeState}
							activities={filteredData.filter(d => ["State", "Federal"].includes(d["Level"]) && d["State/US"] === activeState.state )}
							filtersSchema={filtersSchema}
							hasFilters={hasFilters}
							onClickActivityRow={onClickActivityRow} />
					</Panel>
				: null}

				{!filterOpen && activeActivity ?
					<Panel
						zIndex={40}
						onClosePanel={onActivityPanelClose}>
						<ActivityPanel
							activitySchema={activitySchema}
							activity={activeActivity} />
					</Panel>
				: null}

			</main>
			
		</div>
	);
}