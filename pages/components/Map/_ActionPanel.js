import { useEffect, useState, useRef } from "react";

import CloseBttn from "../Icon/_CloseBttn";

const fieldTitles = {
	"Title/Summary": "Title",
	"Body Name": "Body Name",
	"State/US": "State",
	"Level": "Level of government involved",
	"Bill #": "Bill #",
	"Authority Type": "Type of action involved",
	"Date Intro": "Date initiated",
};

export default function ActionPanel({ action, closeBttn }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === action.index ? {} : action : action;
		setPanelData(newPanelData);
	}, [action]);

	// useEffect(() => {
	// 	onActionChange(panelData);
	// }, [panelData]);

	const fieldElem = (fieldKey) => {
		const fieldTitle = fieldTitles[fieldKey];
		return (
			<li
				key={fieldKey}
				className="mb-2">
				<small>{fieldTitle}</small>
				<div>{panelData[fieldKey]}</div>
			</li>
		);
	};

	return (
		<>
			<header className="flex p-4">
				<h2>
					<strong>{panelData["State/US"] || panelData["state"]}</strong>
				</h2>
				{closeBttn}
			</header>
			<ul className="mb-2 p-4 border-t">
				{Object.keys(fieldTitles).map(key => fieldElem(key))}
			</ul>
		</>
	);
}