// import { useEffect, useState, useRef } from "react";

import Checkbox from "./_Checkbox";

export default function Accordion({ group, onClick }) {
	return(
		<details
			open
			className="relative p-4 border-b">
			<summary
				data-group={group.label}
				className="w-full pb-2 cursor-pointer">
				{group.label}
			</summary>

			{group.options ?
				<div
					role="listbox"
					aria-multiselectable="true"
					className="">
					{group.options.map((val, key) => (
						<Checkbox
							key={key}
							val={val}
							id={`${group.label}_${val}`}
							group={group.label}
							// selected={filterData[group.label].includes(val)}
							onClick={onClick} />
					))}
				</div>
			: null}
		</details>
	);
}