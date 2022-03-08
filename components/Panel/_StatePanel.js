import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

import Accordion from "./_Accordion";
import CloseBttn from "./../Icon/_CloseBttn";

export default function StatePanel({ state, activities, filtersSchema, hasFilters, onClickActivityRow, closeBttn }) {
	const [panelData, setPanelData] = useState({});

	const passedActivities = activities.filter(d => d["Summary Status"] === "Enacted");
	const introducedActivities = activities.filter(d => d["Summary Status"] !== "Enacted");

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === state.index ? {} : state : state;
		setPanelData(newPanelData);
	}, [state]);

	const ProgessGroup = ({ title, progressGroupActivities }) => {
		const progressGroupLength = progressGroupActivities.length;
		return(
			<div className="py-6 px-4 border-b">
				<header className="">
					<h3 className="heading-2 inline">
						{title}
					</h3>
					{hasFilters ?
						<span className="ml-1 relative -top-0.5 text-sm">
							({progressGroupLength}/{state.activities.length})
						</span>
					: null}
				</header>

				<div className="ml-4">
					{filtersSchema["Authority Type"].options.map((type, index) => {
						const typeGroupActivities = progressGroupActivities.filter(a => a["Authority Type"] === type);
						return (
							typeGroupActivities.length ?
								<TypeGroup
									key={index}
									type={type}
									typeGroupActivities={typeGroupActivities}
									progressGroupLength={progressGroupLength} />
							: null
						)
					})}
				</div>
			</div>
		)
	};

	const TypeGroup = ({ type, typeGroupActivities, progressGroupLength }) => {
		return(
			<div className="mt-6">
				<header className="mb-3">
					<h4 className="heading-3 inline">
						{getText(type)}
					</h4>
					<span className="ml-1 relative -top-0.5 text-sm">
						({typeGroupActivities.length}/{progressGroupLength})
					</span>
				</header>

				{typeGroupActivities.map((activity, index) => (
					<ActivityRow key={index} activity={activity} />
				))}
			</div>
		)
	};

	const ActivityRow = ({ activity, index }) => {
		return(
			<div
				className="w-full flex mb-2 cursor-pointer list-none"
				onClick={() => onClickActivityRow(activity)}>
				<div className="w-full pr-4">
					<div className="text-md">
						{activity["Bill #"] || activity["Title/Summary"]}
					</div>
					<div className="text-sm">
						{getDate(activity["Date Intro"])}
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

	return (
		<>
			<header className="p-4 border-b">
				<div className="flex">
					<h2 className="heading-1 mb-2">
						State-level activities in {getText(panelData.state)}
					</h2>
					{closeBttn}
				</div>
				<div>
					{hasFilters ?
						`Displaying ${activities.length} out of ${state.activities.length}.
						${state.activities.length ? "Clear filters to see all." : ""}`
					: ""}
				</div>
			</header>

			<div className="overflow-y-scroll pb-16">

				{passedActivities.length ?
					<ProgessGroup
						title="Passed"
						progressGroupActivities={passedActivities} />
				: null}

				{introducedActivities.length ?
					<ProgessGroup
						title="Introduced"
						progressGroupActivities={introducedActivities} />
				: null}

				{/*{state && state.activities.map((activity, index) => (
					<div key={index}
						className="w-full flex p-4 cursor-pointer font-bold list-none border-b"
						onClick={() => onClickActivityRow(activity)}>
						<div className="w-full pr-4 text-sm">
							{activity["Bill #"] || activity["Title/Summary"]}
						</div>
						<div
							className="w-4 ml-auto mb-auto -rotate-90">
							<img
								src="/IconChevron.svg"
								alt=""
								width={16}
								height={16} />
						</div>
					</div>
				))}*/}
			</div>
		</>
	);
}