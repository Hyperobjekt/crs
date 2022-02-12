import { useEffect, useState, useRef } from "react";

export default function Tooltip({ data = {}, transform }) {
	const tooltipRef = useRef(null);
	const [style, setStyle] = useState({ left: -999999, top: -999999 });

	const MARGIN = 10;

	useEffect(() => {
		if(!data) return;
		const rect = tooltipRef.current.getBoundingClientRect();
		const { coords } = data;
		let [x, y] = coords;

		x = x * transform.k + transform.x - rect.width/2 + 15/2;
		y = y * transform.k + transform.y + 20;

		const offRight = x + rect.width - window.innerWidth + MARGIN;
		const offLeft = MARGIN - x;
		if(offRight > 0) x -= offRight;
		if(offLeft > 0) x += offLeft;

		setStyle({ left: x, top: y });

	}, [data, transform, tooltipRef]);
	
	return (
		<div ref={tooltipRef}
			className="w-64 absolute top-4 right-4 bg-slate-700 text-white"
			style={style}>
			<div className="p-2 pb-0">
				{data["Bill #"]}
			</div>
			<div className="p-2 text-sm">
				{data["Title/Summary"]}
			</div>
			<div className="p-2 border-t border-white text-xs">
				Click to learn more about this activity
			</div>
		</div>
	);
}