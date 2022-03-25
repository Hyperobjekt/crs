import { useEffect, useState, useRef } from "react";

import { getText, getDate, getTitle } from "./../../helpers";

import FieldRow from "./_FieldRow";
import Button from "./../Global/_Button";
import TooltipInfo from "./../Global/_TooltipInfo";

export default function ActivityPanel({ activity, closeBttn, schema }) {
	const [panelData, setPanelData] = useState({});
	const parentRef = useRef(null);

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
		<div ref={parentRef}>
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
									{tooltip ?
										<TooltipInfo parent={parentRef.current}>
											{tooltip}
										</TooltipInfo>
									: null}
								</div>
								<div className="text-sm">
									<Field fieldKey={key} fieldVal={fieldVal} />
								</div>
							</li>
						);
					})}
				</ul>

				{["Full text (link)", "Status (link)"].map((key, index) => (
					panelData[key] ? 
						<div key={key} className="w-full p-4 border-b">
							<div className="flex">
								<Button
									url={panelData[key]}
									style="blue"
									imgSrc="IconExternal.svg">
									{getText(key)}
								</Button>
							</div>
						</div>
					: null
				))}

				{panelData["Date Status Last Checked"] ?
					<div className="p-4 text-sm">
						Progress current as of {getDate(panelData["Date Status Last Checked"])}
					</div>
				: null}

			</div>

		</div>
	);
}