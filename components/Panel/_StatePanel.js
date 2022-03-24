import { useEffect, useState, useRef } from "react";

import { getText, getDate, getTitle } from "./../../helpers";

import Accordion from "./_Accordion";
import CloseBttn from "./../Icon/_CloseBttn";

export default function StatePanel({ state, stateActivities, schema, hasFilters, onClickActivityRow, closeBttn }) {
	const [panelData, setPanelData] = useState({});
	const [activeTab, setActiveTab] = useState("state");

	stateActivities = stateActivities.filter(a =>
		activeTab === "state" ?
			["State","Federal"].includes(a["Level"])
		: !["State","Federal"].includes(a["Level"])
	)

	const passedActivities = stateActivities.filter(a => a["Summary Status"] === "Enacted");
	const introducedActivities = stateActivities.filter(a => a["Summary Status"] !== "Enacted");

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === state.index ? {} : state : state;
		setPanelData(newPanelData);
	}, [state]);

	const ProgessList = ({ title, progressListActivities }) => {
		const progressListLength = progressListActivities.length;
		return(
			<div className="py-6 px-4 border-b">
				<header className="mb-6">
					<h3 className="type-heading-2 inline">
						{title}
					</h3>
					{/*{hasFilters ?
						<span className="ml-1 relative -top-0.5 text-sm">
							({progressListLength}/{state.activities.length})
						</span>
					: null}*/}
				</header>

				<div>
					{progressListLength ?
						schema["Authority Type"].filter.options.map((type, index) => {
							const typeListActivities = progressListActivities.filter(a => a["Authority Type"] === type);
							return (
								typeListActivities.length ?
									<TypeList
										key={index}
										type={type}
										typeListActivities={typeListActivities}
										progressListLength={progressListLength} />
								: null
							)
						})
					: <div className="text-sm text-gray-400">
							No {title.toLowerCase()} activities
						</div>
					}
				</div>
			</div>
		)
	};

	const TypeList = ({ type, typeListActivities, progressListLength }) => {
		return(
			<div className="mb-6">
				<header className="mb-3">
					<h4 className="type-heading-3 inline">
						{getText(type)}
					</h4>
					<span className="ml-1 text-sm">
						({typeListActivities.length}/{progressListLength})
					</span>
				</header>

				{typeListActivities.map((activity, index) => (
					<ActivityRow key={index} activity={activity} />
				))}
			</div>
		)
	};

	const ActivityRow = ({ activity, index }) => {
		return(
			<div
				className="w-full flex mb-4 cursor-pointer list-none"
				onClick={() => onClickActivityRow(activity)}>
				<div className="w-full pr-4">
					<div className="text-md capitalize">
						{getTitle(activity)}
					</div>
					<div className="mt-1 text-sm text-gray-400">
						{activity["Date Passed"] ?
							`Passed ${getDate(activity["Date Passed"])}`
						: activity["Date Intro"] ?
							`Introduced ${getDate(activity["Date Intro"])}`
						: null}
					</div>
				</div>
				<div
					className="w-3 ml-auto mt-1 mb-auto -rotate-90">
					<img
						src="/IconChevron.svg"
						alt=""
						width={16}
						height={16} />
				</div>
			</div>
		)
	};

	const tabs = ["State", "Local"];

	const onTabClick = (tab) => setActiveTab(tab)

	return (
		<>
			<header className="p-4 pb-0 border-b">
				<div className="flex">
					<h2 className="type-heading-1 mb-2">
						{panelData.state !== "US" ?
							`Activity in ${getText(panelData.state)}`
						: "Federal-level activities"}
					</h2>
					{closeBttn}
				</div>
				{/*<div>
					{hasFilters ?
						`Displaying ${activities.length} out of ${state.activities.length}.
						${state.activities.length ? "Clear filters to see all." : ""}`
					: ""}
				</div>*/}
				{panelData.state !== "US" ?
					<div className="flex gap-4">
						{tabs.map(tab => {
							const styles = {
								default: "py-4 cursor-pointer",
								active: "py-4 cursor-pointer border-b-2 border-accent-blue font-bold"
							};
							const style = tab.toLowerCase() === activeTab ? styles.active : styles.default
							return(
								<div
									key={tab}
									tabIndex={0}
									className={style}
									onClick={() => onTabClick(tab.toLowerCase())}>
									{tab}-level
								</div>
							)
						})}
					</div>
				: null}
			</header>

			<div className="overflow-y-scroll pb-16">

				<ProgessList
					title="Passed"
					progressListActivities={passedActivities} />

				<ProgessList
					title="Introduced"
					progressListActivities={introducedActivities} />

			</div>
		</>
	);
}