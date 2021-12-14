import React, { useEffect, useState, useRef } from "react";

const fieldTitles = {
	"Title/Summary": "Title",
	"Body Name": "Body Name",
	"State/US": "State",
	"Level": "Level of government involved",
	"Bill #": "Bill #",
	"Authority Type": "Type of action involved",
	"Date Intro": "Date initiated",
};

export default function Panel({ activeFeature, onPanelChange }) {
	const [panelData, setPanelData] = useState(null);

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === activeFeature.index ? null : activeFeature : activeFeature;
		setPanelData(newPanelData);
	}, [activeFeature]);

	useEffect(() => {
		onPanelChange(panelData);
	}, [panelData]);

	const fieldElem = (fieldKey) => {
		const fieldTitle = fieldTitles[fieldKey];
		return(
			<li
				key={fieldKey}
				style={{ marginBottom: 10 }}>
				<small>{fieldTitle}</small>
				<div>{panelData[fieldKey]}</div>
			</li>
		);
	};

	const closePanel = () => {
		setPanelData(null);
	};

	return (
		panelData ?
			<div
				id="panel"
				style={{ zIndex: 2, position: "fixed", left: 0, top: 0, background: "white", padding: 20 }}>
				<ul style={{ marginBottom: 10 }}>
					{Object.keys(fieldTitles).map(key => fieldElem(key))}
				</ul>
				<button
					onClick={closePanel}>
					Close
				</button>
			</div>
		: null
	);
}