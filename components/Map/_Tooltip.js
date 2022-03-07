import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

export default function Tooltip({ data = {}, transform }) {
	const tooltipRef = useRef(null);
	const [style, setStyle] = useState({ left: -999999, top: -999999 });

	const MARGIN = 10;

	useEffect(() => {
		if(!data) return;
		const rect = tooltipRef.current.getBoundingClientRect();
		const { coords } = data;
		let [x, y] = coords;

		x = x * transform.k + transform.x - rect.width/2 + data.offsetX;
		y = y * transform.k + transform.y + 40;

		const offRight = x + rect.width - window.innerWidth + MARGIN;
		const offLeft = MARGIN - x;
		if(offRight > 0) x -= offRight;
		if(offLeft > 0) x += offLeft;

		setStyle({ left: x, top: y });

	}, [data, transform, tooltipRef]);
	
	return (
		<div ref={tooltipRef}
			className="w-64 absolute top-4 right-4 z-10 bg-slate-900 rounded-lg text-white pointer-events-none"
			style={style}>

			<div
				className="w-0 h-0 absolute left-1/2 -top-3 -ml-3 text-slate-900"
				style={{
					borderLeft: ".75rem solid transparent",
					borderRight: ".75rem solid transparent",
					borderBottom: ".75rem solid"
				}}>
			</div>

			{data.hasOwnProperty("activities") ?
				<div>
					<div className="p-4">
						<div className="pb-2 text-lg font-bold">
							{getText(data["state"])}
						</div>
					</div>
				</div>
			: <div>
				{data["Level"].includes("Local") ?
					<div className="p-4">
						<div className="pb-2 text-lg font-bold">
							{getText(data["Authority Type"])} ({getDate(data["Date Intro"])})
						</div>
						<div className="">
							{getText(data["Body Name"])}
						</div>
					</div>
				: null}

				{data["Level"] === "State" ?
					<div className="p-4">
						
					</div>
				: null}
			</div>}

			<div className="p-4 border-t border-white text-xs">
				Click to learn more about this {data.hasOwnProperty("activities") ? "this state's activity" : "activity"}
			</div>

		</div>
	);
}