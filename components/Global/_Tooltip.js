import { useState, useEffect, useRef } from "react";

export default function Tooltip({ parent, children }) {
	const tooltipRef = useRef(null);
	const [style, setStyle] = useState(style);

	useEffect(() => {
		if(!tooltipRef.current) return;
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const parentRect = parent ? parent.getBoundingClientRect() : null;
		let newStyle = {};
		if(tooltipRect.left <= 0) {
			newStyle = { transform: `translateX(${tooltipRect.left * -1}px)` };
		} else if(parentRect && tooltipRect.right >= parentRect.width) {
			newStyle = { transform: `translateX(${parentRect.width - tooltipRect.right}px)` };
		}
		setStyle(newStyle);
	}, [tooltipRef, parent, children]);

	return (
		<div
			ref={tooltipRef}
			className="w-64 px-4 pb-4 absolute z-20 top-8 left-0 -translate-x-1/2">

			<div
				className="w-0 h-0 absolute left-1/2 -top-3 -ml-3 text-slate-900"
				style={{
					borderLeft: ".75rem solid transparent",
					borderRight: ".75rem solid transparent",
					borderBottom: ".75rem solid"
				}}>
			</div>

			<div
				className="bg-slate-900 rounded-lg transition-transform transition-0"
				style={style}>
				{children}
			</div>
		</div>
	);
};