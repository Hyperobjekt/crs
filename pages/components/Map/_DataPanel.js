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

export default function DataPanel({ activeFeature, closeBttn }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === activeFeature.index ? {} : activeFeature : activeFeature;
		setPanelData(newPanelData);
	}, [activeFeature]);

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
			<ul className="mb-2">
				{Object.keys(fieldTitles).map(key => fieldElem(key))}
			</ul>
			{closeBttn}
		</>
	);
}