import { useEffect, useState, useRef } from "react";
import { getText, getDate, getTitle } from "./../../helpers";
import Tooltip from "../Global/_Tooltip";

export default function MapTooltip({ data = {}, transform }) {
	const tooltipRef = useRef(null);
	const [style, setStyle] = useState({});
	const [open, setOpen] = useState(false);

	// useEffect(() => {
	// 	setOpen(true);
	// }, []);

	useEffect(() => {
		if(!data) return;
		// const rect = tooltipRef.current.getBoundingClientRect();
		const { coords } = data;
		let [x, y] = coords;

		x = x * transform.k + transform.x;
		y = y * transform.k + transform.y;

		// x = x * transform.k + transform.x + data.offset[0];
		// y = y * transform.k + transform.y + data.offset[1];

		// x = x * transform.k + transform.x - rect.width/2 + data.offset[0];
		// y = y * transform.k + transform.y + 40  + data.offset[1];

		// const offRight = x + rect.width - window.innerWidth + MARGIN;
		// const offLeft = MARGIN - x;
		// if(offRight > 0) x -= offRight;
		// if(offLeft > 0) x += offLeft;
		// const style = { left: `${x}px`, top: `${y}px` };
		// const style = { left: x, top: y };
		setStyle({ position: "absolute", left: x, top: y });

	}, [data, transform, tooltipRef]);

	return(
		<div className="absolute pointer-events-none" style={style}>
			<Tooltip open={true}>
				<div>
					{data.hasOwnProperty("state") ?
						<div className="p-4">
							<div className="pb-2 text-lg font-bold text-gray-blue-200">
								{getText(data["state"])}
							</div>
							<div className="text-gray-blue-400">
								{/*{data.passed} passed, {data.introduced} introduced*/}
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
			</Tooltip>
		</div>
	);
	
	// return (
	// 	<div ref={tooltipRef}
	// 		className="w-60 absolute top-4 right-4 z-10 bg-slate-900 rounded-lg text-white pointer-events-none"
	// 		style={style}>

	// 		<div
	// 			className="w-0 h-0 absolute left-1/2 -top-3 -ml-3 text-slate-900"
	// 			style={{
	// 				borderLeft: ".75rem solid transparent",
	// 				borderRight: ".75rem solid transparent",
	// 				borderBottom: ".75rem solid"
	// 			}}>
	// 		</div>

			

	// 	</div>
	// );
}