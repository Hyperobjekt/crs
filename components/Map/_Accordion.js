import { useState } from "react";
import Image from "next/image";

import getText from "./../../helpers/getText";

export default function Accordion({ label, children }) {
	const DEFAULT_OPEN = true;

	const [pseudoOpen, setPseudoOpen] = useState(DEFAULT_OPEN);

	return(
		<details
			open={DEFAULT_OPEN}
			className="relative border-b">
			<summary
				className="w-full flex p-4 cursor-pointer font-bold list-none"
				onClick={() => setPseudoOpen(!pseudoOpen)}>
				<div className="w-full pr-4 text-sm">
					{label}
				</div>
				<div
					className="w-4 ml-auto mb-auto"
					style={{ transform: pseudoOpen ? "rotate(180deg)" : "" }}>
					<Image
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