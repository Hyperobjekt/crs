import { useEffect, useState, useRef } from "react";

import { SubHeader, Modal } from "./../components/Global";
import Panel from "./../components/Panel";
import ActivityPanel from "./../components/Panel/_ActivityPanel";
import StatePanel from "./../components/Panel/_StatePanel";
import FilterPanel from "./../components/Panel/_FilterPanel";
import Map from "./../components/Map";
import Table from "./../components/Table";

import statesGeo from "./../data/states";
import localsGeo from "./../data/locals";
import { activities } from "../data/activities";
import schema from "./../data/schema";

export const getStaticProps = async () => {
	return {
		props: {
			statesGeo: statesGeo,
			localsGeo: localsGeo,
			activities: activities,
			schema: schema
		}
	}
}

export default function Index({ statesGeo, localsGeo, activities, schema }) {
	const [activeView, setActiveView] = useState("map");
	const [activeActivity, setActiveActivity] = useState(null);
	const [activeState, setActiveState] = useState(null);
	const [activeFilters, setActiveFilters] = useState({});
	const [activeCount, setActiveCount] = useState(localsGeo.features.length);
	const [filteredActivities, setFilteredData] = useState(activities);
	const [hasFilters, setHasFilters] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(true);

	useEffect(() => {
		const activeGroups = Object.keys(activeFilters).filter(groupKey => activeFilters[groupKey].length);
		const newFilteredData = activities.filter(d => {
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
				}).length === activeGroups.length
			: true;
		});
		setFilteredData(newFilteredData);
	}, [activeFilters]);

	useEffect(() => {
		if(activeActivity || activeState) setFilterOpen(false);
	}, [activeState, activeActivity]);

	const onViewClick = (view) => {
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

	const onModalButtonClick = (e) => {
		const view = e.target.value;
		setActiveView(view);
		console.log(view);
		setModalOpen(false);
	};

	return(
		<div
			id="page"
			className="w-screen h-screen flex flex-col">

			<Modal
				modalOpen={modalOpen}
				activeView={activeView}
				setModalOpen={setModalOpen}
				setActiveView={setActiveView} />

			<SubHeader
				filterOpen={filterOpen}
				activeView={activeView}
				activeFilters={activeFilters}
				activityCount={activities.length}
				onFilterPanelToggle={onFilterPanelToggle}
				onFilterChange={onFilterChange}
				onViewClick={onViewClick} />

			<main
				className="flex flex-1 relative"
				style={{
					overflow: "hidden",
					height: activeView === "table" ? "100%" : null,
				}}>

				<div
					aria-hidden={activeView !== "map"} 
					className="w-full flex relative"
					style={activeView !== "map" ? {
						position: "absolute",
						left: "-9999999px"
					} : null}>
					<Map
						statesGeo={statesGeo}
						localsGeo={localsGeo}
						filteredActivities={filteredActivities}
						activeFilters={activeFilters}
						activeActivity={activeActivity}
						activeState={activeState}
						setActiveActivity={setActiveActivity}
						setActiveState={setActiveState}
						setModalOpen={setModalOpen} />
				</div>

				<div
					aria-hidden={activeView !== "table"} 
					className="w-full h-full"
					style={activeView !== "table" ? {
						position: "absolute",
						left: "-9999999px"
					} : null}>
					<Table
						schema={schema}
						filteredActivities={filteredActivities}
						setActiveActivity={setActiveActivity} />
				</div>

				<Panel
					open={filterOpen}
					zIndex={60}
					onClosePanel={onFilterPanelClose}>
					<FilterPanel
						schema={schema}
						activeCount={activeCount}
						activeFilters={activeFilters}
						onFilterChange={onFilterChange} />
				</Panel>

				<Panel
					open={activeState}
					zIndex={30}
					onClosePanel={onStatePanelClose}>
					{activeState ?
						<StatePanel
							schema={schema}
							state={activeState}
							stateActivities={filteredActivities.filter(d => d["State/US"] === activeState.state )}
							onClickActivityRow={onClickActivityRow} />
					: null}
				</Panel>

				<Panel
					open={activeActivity}
					zIndex={50}
					onClosePanel={onActivityPanelClose}>
					{activeActivity ?
						<ActivityPanel
							schema={schema}
							activity={activeActivity} />
					: null}
				</Panel>

			</main>
			
		</div>
	);
}