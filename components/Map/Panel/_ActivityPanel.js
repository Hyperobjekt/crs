import { useEffect, useState, useRef } from "react";

import getText from "./../../../helpers/getText";
import getDate from "./../../../helpers/getDate";

import FieldRow from "./_FieldRow";
import ButtonExt from "./../../Global/_ButtonExt";

export default function ActivityPanel({ activity, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		// const newPanelData = panelData ? panelData.index === activity.index ? {} : activity : activity;
		setPanelData(activity);
	}, [activity]);

	return (
		<>
			<header className="flex p-4">
				<h2>
					<strong>{panelData["Bill #"] || panelData["Title/Summary"]}</strong>
				</h2>
				{closeBttn}
			</header>
			<ul className="mb-2 p-4 border-t">
				{activitySchema ? activitySchema.map(key => {
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
					<div key={key} className="w-full p-4 border-t">
						<ButtonExt url={panelData[key]}>
							{getText(key)}
						</ButtonExt>
					</div>
				: null
			))}

		</>
	);
}