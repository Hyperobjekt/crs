import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers";

import CloseBttn from "../Icon/_CloseBttn";

export default function ActivityPanel({ activity, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === activity.index ? {} : activity : activity;
		setPanelData(newPanelData);
	}, [activity]);

	// useEffect(() => {
	// 	onActivityChange(panelData);
	// }, [panelData]);

	const fieldElem = (fieldKey) => {
		const fieldTitle = getText(fieldKey);
		return (
			<li
				key={fieldKey}
				className="mb-2">
				<small>{fieldTitle}</small>
				<div>{getText(panelData[fieldKey])}</div>
			</li>
		);
	};

	return (
		<>
			<header className="flex p-4">
				<h2>
					<strong>{panelData["Bill #"] || panelData["Title/Summary"]}</strong>
				</h2>
				{closeBttn}
			</header>
			<ul className="mb-2 p-4 border-t">
				{activitySchema.map(key => fieldElem(key))}
			</ul>
		</>
	);
}