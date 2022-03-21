import { useEffect, useState, useRef } from "react";

import { getText, getDate, getTitle } from "./../../helpers";

export default function Tooltip({ data = {}, transform }) {
	const tooltipRef = useRef(null);
	const [style, setStyle] = useState({ left: -999999, top: -999999 });

	const MARGIN = 6;

	useEffect(() => {
		if(!data) return;
		const rect = tooltipRef.current.getBoundingClientRect();
		const { coords } = data;
		let [x, y] = coords;

		x = x * transform.k + transform.x - rect.width/2 + data.offset[0];
		y = y * transform.k + transform.y + 40  + data.offset[1];

		const offRight = x + rect.width - window.innerWidth + MARGIN;
		const offLeft = MARGIN - x;
		if(offRight > 0) x -= offRight;
		if(offLeft > 0) x += offLeft;

		setStyle({ left: x, top: y });

	}, [data, transform, tooltipRef]);
	
	return (
		<div ref={tooltipRef}
			className="w-52 absolute top-4 right-4 z-10 bg-slate-900 rounded-lg text-white pointer-events-none"
			style={style}>

			<div
				className="w-0 h-0 absolute left-1/2 -top-3 -ml-3 text-slate-900"
				style={{
					borderLeft: ".75rem solid transparent",
					borderRight: ".75rem solid transparent",
					borderBottom: ".75rem solid"
				}}>
			</div>

			{data.hasOwnProperty("state") ?
				<div className="p-4">
					<div className="pb-2 text-lg font-bold text-gray-blue-200">
						{getText(data["state"])}
					</div>
					<div className="text-gray-blue-400">
						{data.passed} passed, {data.introduced} introduced
					</div>
				</div>
			: <div className="p-4">
					<div className="pb-2 text-lg font-bold capitalize text-gray-blue-200">
						{getTitle(data)}
					</div>
					<div className="text-gray-blue-400">
						{getDate(data["Date Intro"])}
					</div>
				</div>
			}

			<div className="p-4 border-t border-gray-blue-400 text-xs text-gray-blue-400">
				{data.hasOwnProperty("state") ?
					"Click to see all activity"
				: "Click to learn more about this activity"}
			</div>

		</div>
	);
}