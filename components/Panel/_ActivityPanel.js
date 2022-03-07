import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

import FieldRow from "./_FieldRow";
import Button from "./../Global/_Button";

export default function ActivityPanel({ activity, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		// const newPanelData = panelData ? panelData.index === activity.index ? {} : activity : activity;
		setPanelData(activity);
	}, [activity]);

	return (
		<>
			<header className="p-4 border-b">
				<div className="flex">
					<h2 className="text-xl font-bold">
						{getText(panelData["Authority Type"])} ({getDate(panelData["Date Intro"])})
					</h2>
					{closeBttn}
				</div>
			</header>

			<div className="overflow-y-scroll pb-16">
				<ul className="p-4 border-b">
					{activitySchema ? activitySchema.fields.map(key => {
						const fieldVal = panelData[key];
						const fieldTitle = getText(key);
						return(
							<li key={key}
								className="mb-2">
								<div className="text-xs">
									{fieldTitle}
								</div>
								<div className="text-sm">
									{key === "Date Intro" ? getDate(fieldVal) : getText(fieldVal)}
								</div>
							</li>
						);
					}) : null}
				</ul>

				{["Status (link)", "Full text (link)"].map(key => (
					panelData[key] ? 
						<div key={key} className="w-full flex p-4 border-b">
							<Button
								url={panelData[key]}
								imgSrc="IconExternal.svg">
								{getText(key)}
							</Button>
						</div>
					: null
				))}
			</div>

		</>
	);
}