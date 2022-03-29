import { useState, useEffect, useRef } from "react";
import Tooltip from "./_Tooltip";

export default function TooltipInfo({ parent, children }) {
	const [hovered, setHovered] = useState(false);

	const onHover = () => {
		setHovered(true);
	};

	const onUnhover = () => {
		setHovered(false);
	};

	return (
		<div className="relative inline-flex ml-1">
			<div
				role="button"
				tabIndex={0}
				className="button-info"
				onMouseEnter={onHover}
				onMouseLeave={onUnhover}
				onFocus={onHover}
				onBlur={onUnhover} />
				<div className="absolute top-6 left-1/2 pointer-events-none">
					<Tooltip
						open={hovered}
						parentWidth={parent ? parent.getBoundingClientRect().width : null}>
						<div className="p-4 text-sm font-normal text-gray-blue-100">
							{children}
						</div>
					</Tooltip>
				</div>
		</div>
	);
};