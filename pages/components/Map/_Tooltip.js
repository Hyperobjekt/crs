import { useEffect, useState, useRef } from "react";

export default function Tooltip({ data, transform = {k:0,x:0,y:0} }) {
	const tooltipRef = useRef(null);
	const [style, setStyle] = useState({left: -999999, top: -999999});

	useEffect(() => {
		if(!data) return;
		const rect = tooltipRef.current.getBoundingClientRect();
		const { coords } = data;
		let [x, y] = coords;

		x *= transform.k;
		y *= transform.k;
		x += transform.x;
		y += transform.y;

		setStyle({
			left: x - rect.width/2 + 15/2,
			top: y + 20
		});

	}, [data, transform, tooltipRef]);
	
	return (
		<div ref={tooltipRef}
			className="w-64 absolute top-4 right-4 bg-slate-700 text-white"
			style={style}>
			<div className="p-2 pb-0">
				{data["State/US"]}
			</div>
			<div className="p-2 text-sm">
				{data["Title/Summary"]}
			</div>
			<div className="p-2 border-t border-white text-xs">
				Click to learn more about this action
			</div>
		</div>
	);
}