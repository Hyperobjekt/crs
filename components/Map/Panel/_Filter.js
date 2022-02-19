import getText from "./../../../helpers/getText";

import Checkbox from "./_Checkbox";
import DateSelector from "./_DateSelector";

export default function Filter({ group, schema, activeFilters = {}, onChange }) {

	const onCheckboxChange = (e) => {
		const { group, value } = e.target.dataset;
		const groupData = activeFilters.hasOwnProperty(group) ? activeFilters[group] : [];
		const valueIndex = groupData.indexOf(value);
		const newFilters = valueIndex > -1 ? groupData.filter(f => f !== value) : [...groupData, value];
		if(newFilters.length) {
			onChange({...activeFilters, [group]: newFilters });
		} else {
			delete activeFilters[group];
			onChange({...activeFilters});
		}
	};

	const onDateChange = (newDates) => {
		const newFilters = newDates && (newDates[0] || newDates[1]) ? { "Date Intro": newDates } : {};
		onChange({...activeFilters, ...newFilters });
	}

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
							onChange={onCheckboxChange} />
					))}
				</div>
			: null}


			{group === "Date Intro" ?
				<div>
					<DateSelector
						start={activeFilters["Date Intro"] ? activeFilters["Date Intro"][0] : null}
						end={activeFilters["Date Intro"] ? activeFilters["Date Intro"][1] : null}
						onChange={onDateChange} />
				</div>
			: null}
		</>
	)
}