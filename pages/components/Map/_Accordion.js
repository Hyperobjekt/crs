// import { useEffect, useState, useRef } from "react";

import Checkbox from "./_Checkbox";

export default function Accordion({ schema, activeFilters, onChange }) {
	return(
		<details
			open
			className="relative p-4 border-b">
			<summary
				data-group={schema.label}
				className="w-full pb-2 cursor-pointer">
				{schema.label}
			</summary>

			{schema.options ?
				<div
					role="listbox"
					aria-multiselectable="true"
					className="">
					{schema.options.map((option, i) => (
						<Checkbox
							key={i}
							val={option.key}
							label={option.label}
							id={`${schema.label}_${option.key}`}
							group={schema.label}
							active={activeFilters[schema.label] ? activeFilters[schema.label].includes(option.key) : false}
							onChange={onChange} />
					))}
				</div>
			: null}
		</details>
	);
}