import { useEffect, useState } from "react";

import { getText, getDate, getTitle } from "./../../helpers";

export default function StatePanel({
	state,
	stateActivities,
	schema,
	hasFilters,
	onClickActivityRow,
	closeBttn,
}) {
	const [panelData, setPanelData] = useState({});
	const [activeTab, setActiveTab] = useState("state");

	stateActivities = stateActivities.filter(a =>
		activeTab === "state" ?
			["State","Federal"].includes(a.level)
		: !["State","Federal"].includes(a.level)
	)

	const adoptedActivities = stateActivities.filter(a => a.progress === "Enacted");
	const introducedActivities = stateActivities.filter(a => a.progress !== "Enacted");

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
				</header>
				<div>
					{progressListLength ?
						schema.type.filter.options.map((type, index) => {
							const typeListActivities = progressListActivities.filter(a =>
								a.type === (typeof type === "object" ? type.key : type)
							);
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
					: <div className="text-md text-gray-400">
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
						{getText(typeof type === "object" ? type.key : type)}
					</h4>
					<span className="ml-1 text-md">
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
					<div className="mt-1 text-md text-gray-400">
						{activity.date_passed ?
							`Adopted ${getDate(activity.date_passed)}`
						: activity.date_intro ?
							`Introduced ${getDate(activity.date_intro)}`
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
					title="Adopted"
					progressListActivities={adoptedActivities} />
				<ProgessList
					title="Introduced"
					progressListActivities={introducedActivities} />
			</div>
		</>
	);
}