import { useEffect, useState, useRef } from "react";

import { getText, getDate, getTitle } from "./../../helpers";

import FieldRow from "./_FieldRow";
import Button from "./../Global/_Button";
// import Tooltip from "./../Global/_Tooltip";

// const fields = [
// 	"Level",
// 	"State/US",
// 	"Body Name",
// 	"Bill #",
// 	"Activity Type",
// 	"Date Intro",
// 	"Progress",
// 	"Target Institution",
// 	"Conduct Regulated",
// 	"Content Trigger",
// 	"Enforcement Mechanism",
// 	"Category",
// 	"Related Bill(s)"
// ];

export default function ActivityPanel({ activity, closeBttn, schema }) {
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
					{fieldVal.map((v,i) => <li key={i} className="mt-1">{getText(v)}</li>)}
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
					<h2 className="text-xl font-bold capitalize">
						{getTitle(panelData) || "Activity"}
					</h2>
					{closeBttn}
				</div>
			</header>

			<div className="overflow-y-scroll pb-6">
				<ul className="p-4 pt-6 border-b">
					{Object.keys(schema).filter(k => panelData[k]).map(key => {
						const fieldVal = panelData[key];
						const fieldTitle = getText(key);
						const tooltip = schema[key].tooltip;						
						return(
							<li key={key}
								className="mb-3">
								<div className="mb-0.5 text-sm text-gray-500">
									{fieldTitle}
									{/*{tooltip ?
										<Tooltip parent={null}>
											{tooltip}
										</Tooltip>
									: null}*/}
								</div>
								<div className="text-sm">
									<Field fieldKey={key} fieldVal={fieldVal} />
								</div>
							</li>
						);
					})}
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