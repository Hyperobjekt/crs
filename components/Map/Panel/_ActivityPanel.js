import { useEffect, useState, useRef } from "react";

import FieldRow from "./_FieldRow";

export default function ActivityPanel({ activity, closeBttn, activitySchema }) {
	const [panelData, setPanelData] = useState({});

	useEffect(() => {
		// const newPanelData = panelData ? panelData.index === activity.index ? {} : activity : activity;
		setPanelData(activity);
	}, [activity]);

	return (
		<>
			<header className="flex p-4">
				<h2>
					<strong>{panelData["Bill #"] || panelData["Title/Summary"]}</strong>
				</h2>
				{closeBttn}
			</header>
			<ul className="mb-2 p-4 border-t">
				{activitySchema ? activitySchema.map(key => (
					<FieldRow
						key={key}
						fieldKey={key}
						fieldVal={panelData[key]} />
				)) : null}
			</ul>
		</>
	);
}