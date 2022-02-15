import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";

import Accordion from "./_Accordion";
import CloseBttn from "../Icon/_CloseBttn";

export default function StatePanel({ state, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === state.index ? {} : state : state;
		setPanelData(newPanelData);
	}, [state]);

	const fieldElem = (activity, fieldKey) => {
		const fieldTitle = getText(fieldKey);
		return (
			<li
				key={fieldKey}
				className="mb-2">
				<div className="text-xs">{fieldTitle}</div>
				<div className="text-sm">{getText(activity[fieldKey])}</div>
			</li>
		);
	};

	return (
		<>
			<header className="flex p-4 border-b">
				<h2>
					<strong>{getText(panelData.state)}</strong>
				</h2>
				{closeBttn}
			</header>
			{state && state.activities.map((activity, index) => (
				<Accordion
					key={index}
					open={false}
					label={activity["Bill #"] || activity["Title/Summary"]}>
					<ul>
						{activitySchema ? activitySchema.map(key => fieldElem(activity, key)) : null}
					</ul>
				</Accordion>
			))}
		</>
	);
}