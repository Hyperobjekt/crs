import { useState, useEffect, useRef } from "react";

export default function Tooltip({ open, parent, children }) {
	const tooltipRef = useRef(null);
	const [outerStyle, setOuterStyle] = useState({});
	const [innerStyle, setInnerStyle] = useState({});

	useEffect(() => {
		setTimeout(() => setOuterStyle(
			open ? {
				top: "2.5rem",
				opacity: 1
			} : {}
		), 10);
	}, [open, parent, children]);

	useEffect(() => {
		if(!tooltipRef.current) return;
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const parentRect = parent ? parent.getBoundingClientRect() : null;
		let newInnerStyle = {};
		if(tooltipRect.left <= 0) {
			newInnerStyle = { transform: `translateX(${tooltipRect.left * -1}px)` };
		} else if(parentRect && tooltipRect.right >= parentRect.width) {
			newInnerStyle = { transform: `translateX(${parentRect.width - tooltipRect.right}px)` };
		}
		setInnerStyle(newInnerStyle);
		
	}, [tooltipRef, parent, children]);

	return (
		<div
			ref={tooltipRef}
			style={outerStyle}
			className="w-64 px-4 pb-4 opacity-0 absolute z-20 top-12 left-0 -translate-x-1/2 transition-all"
			aria-hidden={!open}>

			<div
				className="w-0 h-0 absolute left-1/2 -top-3 -ml-3 text-slate-900"
				style={{
					borderLeft: ".75rem solid transparent",
					borderRight: ".75rem solid transparent",
					borderBottom: ".75rem solid"
				}}>
			</div>

			<div
				className="bg-slate-900 rounded-lg transition-transform"
				style={innerStyle}>
				{children}
			</div>
		</div>
	);
};