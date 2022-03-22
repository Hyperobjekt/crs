import { useEffect, useState, useRef } from "react";

import Header from "./../components/Header";
import Menu from "./../components/Menu";
import Panel from "./../components/Panel";
import ActivityPanel from "./../components/Panel/_ActivityPanel";
import StatePanel from "./../components/Panel/_StatePanel";
import FilterPanel from "./../components/Panel/_FilterPanel";
import SubHeader from "./../components/Header/_SubHeader";
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
	const [showMenu, setShowMenu] = useState(false);

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

	const onMenuClick = () => {
		setShowMenu(!showMenu)
	}

	return(
		<div
			id="page"
			className="w-screen h-screen flex flex-col">

			{/*<Header activeView={activeView} activityCount={activities.length} onViewClick={onViewClick} onMenuClick={onMenuClick} />*/}

			{/*<Menu showMenu={showMenu} />*/}

			<SubHeader
				filterOpen={filterOpen}
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
					className="w-full flex"
					style={{ display: activeView === "map" ? "block" : "none" }}>
					<Map
						statesGeo={statesGeo}
						localsGeo={localsGeo}
						filteredActivities={filteredActivities}
						activeFilters={activeFilters}
						activeActivity={activeActivity}
						activeState={activeState}
						setActiveActivity={setActiveActivity}
						setActiveState={setActiveState} />
				</div>

				<div 
					className="w-full h-full"
					style={{ display: activeView === "table" ? "block" : "none" }}>
					<Table
						filteredActivities={filteredActivities}
						setActiveActivity={setActiveActivity} />
				</div>

				{filterOpen ?
					<Panel
						zIndex={50}
						onClosePanel={onFilterPanelClose}>
						<FilterPanel
							schema={schema}
							activeCount={activeCount}
							activeFilters={activeFilters}
							onFilterChange={onFilterChange} />
					</Panel>
				: null}

				{!filterOpen && activeState && !activeActivity ?
					<Panel
						zIndex={30}
						onClosePanel={onStatePanelClose}>
						<StatePanel
							schema={schema}
							state={activeState}
							stateActivities={filteredActivities.filter(d => d["State/US"] === activeState.state )}
							hasFilters={hasFilters}
							onClickActivityRow={onClickActivityRow} />
					</Panel>
				: null}

				{!filterOpen && activeActivity ?
					<Panel
						zIndex={40}
						onClosePanel={onActivityPanelClose}>
						<ActivityPanel
							schema={schema}
							activity={activeActivity} />
					</Panel>
				: null}

			</main>
			
		</div>
	);
}