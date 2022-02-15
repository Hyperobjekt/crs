import { useEffect, useState, useRef } from "react";

import getText from "./../../../helpers/getText";

import Accordion from "./_Accordion";
import CloseBttn from "../../Icon/_CloseBttn";
import FieldRow from "./_FieldRow";

export default function StatePanel({ state, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		const newPanelData = panelData ? panelData.index === state.index ? {} : state : state;
		setPanelData(newPanelData);
	}, [state]);

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
						{activitySchema ? activitySchema.map(key => (
							<FieldRow
								key={key}
								fieldKey={key}
								fieldVal={activity[key]} />
						)) : null}
					</ul>
				</Accordion>
			))}
		</>
	);
}