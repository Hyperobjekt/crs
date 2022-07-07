import { useState, useRef } from "react";
import { getText } from "./../../helpers";
import { TooltipInfo } from "../Utils";

export default function Accordion({
	label,
	tooltip,
	open,
	children,
}) {
	const parentRef = useRef(null);
	const [pseudoOpen, setPseudoOpen] = useState(open);

	return(
		<details
			ref={parentRef}
			open={open}
			className="relative border-b">
			<summary
				className="w-full flex p-4 cursor-pointer font-bold list-none"
				onClick={() => setPseudoOpen(!pseudoOpen)}>
				<div className="w-full pr-4">
					<h3 className="type-heading-3 inline">
						{label}
					</h3>
					{tooltip ?
						<TooltipInfo parent={parentRef.current}>
							{tooltip}
						</TooltipInfo>
					: null}
				</div>
				<div
					className="w-4 ml-auto mb-auto"
					style={{ transform: pseudoOpen ? "rotate(180deg)" : "" }}>
					<img
						src="/IconChevron.svg"
						alt=""
						width={16}
						height={16} />
				</div>
			</summary>

			<div className="px-4 pb-4">
				{children}
			</div>

		</details>
	);
}