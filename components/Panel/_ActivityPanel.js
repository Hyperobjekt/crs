import { useEffect, useState, useRef } from "react";

import { getText, getDate, getTitle } from "./../../helpers";

import FieldRow from "./_FieldRow";
import Button from "./../Global/_Button";

export default function ActivityPanel({ activity, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		setPanelData(activity);
	}, [activity]);

	const Field = ({ fieldKey, fieldVal }) => {
		let fieldContent;
		if(fieldKey === "Date Intro") {
			fieldContent = getDate(fieldVal);
		} else if(Array.isArray(fieldVal) && fieldVal.length) {
			fieldContent = (
				<ul>
					{fieldVal.map((v,i) => <li key={i}>{getText(v)}</li>)}
				</ul>
			);
		} else if(typeof fieldVal === "string") {
			fieldContent = getText(fieldVal);
		}
		return fieldContent ? fieldContent : "N/A";
	};

	return (
		<>
			<header className="p-4 border-b">
				<div className="flex">
					<h2 className="text-xl font-bold">
						{getTitle(panelData) || "Activity"}
					</h2>
					{closeBttn}
				</div>
			</header>

			<div className="overflow-y-scroll pb-16">
				<ul className="p-4 pt-6 border-b">
					{activitySchema ? activitySchema.fields.map(key => {
						const fieldVal = panelData[key];
						const fieldTitle = getText(key);
						return(
							<li key={key}
								className="mb-2">
								<div className="text-sm text-gray-500">
									{fieldTitle}
								</div>
								<div className="text-sm">
									<Field fieldKey={key} fieldVal={fieldVal} />
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
								style="blue"
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