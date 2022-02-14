import getText from "./../../helpers/getText";

import Checkbox from "./_Checkbox";
import DateSelector from "./_DateSelector";

export default function Filter({ group, schema, activeFilters = {}, onChange }) {

	return(
		<>
			{schema.options && schema.options.length ?
				<div
					role="listbox"
					aria-multiselectable="true"
					className="">
					{schema.options.map((option, i) => (
						<Checkbox
							key={i}
							val={option}
							label={getText(option)}
							id={`${group}_${option}`}
							group={group}
							active={activeFilters[group] ? activeFilters[group].includes(option) : false}
							onChange={onChange} />
					))}
				</div>
			: null}

			{group === "Date Intro" ?
				<div>
					<DateSelector />
				</div>
			: null}
		</>
	)
}