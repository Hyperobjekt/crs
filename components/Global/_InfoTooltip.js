import { useState, useEffect, useRef } from "react";
import Tooltip from "./_Tooltip";

export default function InfoTooltip({ parent, children }) {
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
				{hovered ? 
					<div className="absolute left-1/2">
						<Tooltip parent={parent}>
							<div className="p-4 text-xs font-normal text-gray-blue-100">
								{children}
							</div>
						</Tooltip>
					</div>
				 : null}
		</div>
	);
};