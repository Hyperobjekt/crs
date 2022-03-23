import { useState, useEffect, useRef } from "react";

export default function Tooltip({ open, parentWidth, children }) {
	const tooltipRef = useRef(null);
	const [outerStyle, setOuterStyle] = useState({});
	const [innerStyle, setInnerStyle] = useState({});

	const MARGIN = 48;

	useEffect(() => {
		setOuterStyle(
			open ? {
				top: "0",
				opacity: 1
			} : {}
		);
	}, [open, parentWidth, children]);

	useEffect(() => {
		if(!tooltipRef.current) return;
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const limitLeft = tooltipRect.width/2 - MARGIN;
		const limitRight = -tooltipRect.width/2 + MARGIN;
		let translateX;
		if(tooltipRect.left <= 0) {
			translateX = tooltipRect.left * -1;
			if(translateX > limitLeft) {
				translateX = limitLeft;
			}
		} else if(parentWidth && tooltipRect.right >= parentWidth) {
			translateX = parentWidth - tooltipRect.right - 12;
			if(translateX < limitRight) {
				translateX = limitRight;
			}
		}
		setInnerStyle({ transform: translateX ? `translateX(${translateX}px)` : "none" });
		
	}, [tooltipRef, parentWidth, children]);

	return (
		<div
			ref={tooltipRef}
			style={outerStyle}
			className="w-64 px-4 pb-4 pt-3 opacity-0 absolute z-20 top-6 left-0 -translate-x-1/2 transition-all"
			aria-hidden={!open}>

			<div
				className="w-0 h-0 absolute left-1/2 top-0 -ml-3 text-slate-900"
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