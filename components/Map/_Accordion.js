import { useState } from "react";
import Image from "next/image";

import getText from "./../../helpers/getText";

export default function Accordion({ label, open, children }) {
	const [pseudoOpen, setPseudoOpen] = useState(open);

	return(
		<details
			open={open}
			className="relative border-b">
			<summary
				className="w-full flex p-4 cursor-pointer font-bold list-none"
				onClick={() => setPseudoOpen(!pseudoOpen)}>
				<div className="w-full pr-4 text-sm">
					{label}
				</div>
				<div
					className="w-4 ml-auto mb-auto"
					style={{ transform: pseudoOpen ? "" : "rotate(180deg)" }}>
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