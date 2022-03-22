import { useState, useEffect, useRef } from "react";

export default function Tooltip({ parent, children }) {
	const tooltipRef = useRef(null);
	const [hovered, setHovered] = useState(false);
	const [style, setStyle] = useState({});

	const onHover = () => {
		setHovered(true);
	};

	const onUnhover = () => {
		setHovered(false);
	};

	useEffect(() => {
		if(!tooltipRef.current) return;
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const parentRect = parent ? parent.getBoundingClientRect() : null;
		if(tooltipRect.left <= 0) {
			setStyle({ transform: `translateX(${tooltipRect.left * -1}px)` });
		}
		if(parentRect && tooltipRect.right >= parentRect.width) {
			setStyle({ transform: `translateX(${parentRect.width - tooltipRect.right}px)` });	
		}
	}, [hovered, tooltipRef, parent]);

	return (
		<>
			<div className="relative inline-flex ml-1">
				<div
					role="button"
					tabIndex={0}
					className="button-info"
					onMouseEnter={onHover}
					onMouseLeave={onUnhover}
					onFocus={onHover}
					onBlur={onUnhover} />
				{hovered ?
					<div
						ref={tooltipRef}
						className="w-60 px-4 pb-4 absolute z-20 top-8 left-2 -translate-x-1/2">

						<div
							className="w-0 h-0 absolute left-1/2 -top-3 -ml-3 text-slate-900"
							style={{
								borderLeft: ".75rem solid transparent",
								borderRight: ".75rem solid transparent",
								borderBottom: ".75rem solid"
							}}>
						</div>

						<div
							className="bg-slate-900 rounded-lg p-4 transition-transform transition-100"
							style={style}>
							<div className="text-xs font-normal text-gray-blue-100">
								{children}
							</div>
						</div>
					</div>
				: null}
			</div>
		</>
	);
};