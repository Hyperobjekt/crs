import { useEffect, useState, useRef } from "react";

import getText from "./../../../helpers/getText";

import Accordion from "./_Accordion";
import CloseBttn from "../../Icon/_CloseBttn";

export default function StatePanel({ state, onClickActivityRow, closeBttn }) {
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
				<div key={index}
					className="w-full flex p-4 cursor-pointer font-bold list-none border-b"
					onClick={() => onClickActivityRow(activity)}>
					<div className="w-full pr-4 text-sm">
						{activity["Bill #"] || activity["Title/Summary"]}
					</div>
					<div
						className="w-4 ml-auto mb-auto -rotate-90">
						<img
							src="/IconChevron.svg"
							alt=""
							width={16}
							height={16} />
					</div>
				</div>
			))}
		</>
	);
}