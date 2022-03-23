import { getText } from "./../../helpers";

import Checkbox from "./_Checkbox";
import DateSelector from "./_DateSelector";

export default function Filter({ group, schema, activeFilters = {}, onChange }) {

	const onCheckboxChange = (e) => {
		const { group, value } = e.target.dataset;
		const groupData = activeFilters.hasOwnProperty(group) ? activeFilters[group] : [];
		const valueIndex = groupData.indexOf(value);
		const newFilters = valueIndex > -1 ? groupData.filter(f => f !== value) : [...groupData, value];
		if(newFilters.length) {
			onChange({ ...activeFilters, [group]: newFilters });
		} else {
			delete activeFilters[group];
			onChange({ ...activeFilters });
		}
	};

	const onDateChange = (newDates) => {
		const newFilters = newDates && (newDates[0] || newDates[1]) ? { "Date Intro": newDates } : null;
		if(newFilters) {
			onChange({ ...activeFilters, ...newFilters });	
		} else {
			delete activeFilters["Date Intro"];
			onChange({ ...activeFilters });
		}
	};

	return(
		<>
			{schema.type === "string" ?
				<div
					role="listbox"
					aria-multiselectable="true">
					{schema.filter.options.map((option, i) => (
						<Checkbox
							key={i}
							val={option}
							label={getText(option)}
							id={`${group}_${option}`}
							group={group}
							active={activeFilters[group] ? activeFilters[group].includes(option) : false}
							onChange={onCheckboxChange} />
					))}
				</div>
			: null}

			{schema.type === "date" ?
				<div>
					<DateSelector
						start={activeFilters["Date Intro"] ? activeFilters["Date Intro"][0] : null}
						end={activeFilters["Date Intro"] ? activeFilters["Date Intro"][1] : null}
						onChange={onDateChange} />
				</div>
			: null}
		</>
	)
};