// import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers";

import Checkbox from "./_Checkbox";

export default function Accordion({ group, schema = {}, activeFilters = {}, onChange }) {
	return(
		<details
			open
			className="relative p-4 border-b">
			<summary
				data-group={schema.key}
				className="w-full pb-2 cursor-pointer">
				{getText(group)}
			</summary>

			{schema.options ?
				<div
					role="listbox"
					aria-multiselectable="true"
					className="">
					{schema.options.map((option, i) => (
						<Checkbox
							key={i}
							val={option}
							label={getText(option)}
							id={`${schema.key}_${option}`}
							group={schema.key}
							active={activeFilters[schema.key] ? activeFilters[schema.key].includes(option) : false}
							onChange={onChange} />
					))}
				</div>
			: null}
		</details>
	);
}