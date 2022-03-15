import { useState } from "react";

import { getText } from "./../../helpers";

export default function Accordion({ label, open, children }) {
	const [pseudoOpen, setPseudoOpen] = useState(open);

	return(
		<details
			open={open}
			className="relative border-b">
			<summary
				className="w-full flex p-4 cursor-pointer font-bold list-none"
				onClick={() => setPseudoOpen(!pseudoOpen)}>
				<h3 className="w-full pr-4 type-heading-3">
					{label}
				</h3>
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