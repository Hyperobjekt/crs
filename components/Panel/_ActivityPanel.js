import { useEffect, useState, useRef } from "react";

import { getText, getDate, getTitle } from "../../helpers";

import FieldRow from "./_FieldRow";
import { Button } from "../Utils";
import { TooltipInfo } from "../Utils";

export default function ActivityPanel({ activity, closeBttn, schema }) {
	const [panelData, setPanelData] = useState({});
	const parentRef = useRef(null);

	useEffect(() => {
		setPanelData(activity);
	}, [activity]);

	const Field = ({ fieldKey, fieldVal, fieldSchema }) => {
		let fieldContent;
		if(fieldSchema.type === "date") {
			fieldContent = getDate(fieldVal);
		} else if(Array.isArray(fieldVal) && fieldVal.length) {
			fieldContent = (
				<ul className="conditional-bullets">
					{fieldVal.map((v,i) => <li key={i} className="mb-0.5">{getText(v)}</li>)}
				</ul>
			);
		} else if(fieldSchema.type === "string") {
			fieldContent = getText(fieldVal);
		}
		return fieldContent ? fieldContent : "";
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

			<div className="overflow-y-scroll pb-6" ref={parentRef}>
				<ul className="p-4 pt-6 border-b">
					{Object.keys(schema)
						.filter(key => panelData[key] && panelData[key].length && panelData[key] !== "N/A")
						.map(key => {
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
									<div className="text-md">
										<Field fieldKey={key} fieldVal={fieldVal} fieldSchema={schema[key]} />
									</div>
								</li>
							);
						})}
				</ul>

				{["url_text", "url_source"].map((key, index) => (
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

				{panelData.date_checked ?
					<div className="p-4 text-md">
						Progress status current as of {getDate(panelData.date_checked)}
					</div>
				: null}

			</div>

		</>
	);
}