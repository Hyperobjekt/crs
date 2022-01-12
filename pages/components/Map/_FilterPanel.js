import { useEffect, useState, useRef } from "react";

// import CloseBttn from "../Icon/_CloseBttn";
import Accordion from "./_Accordion";

export default function FilterPanel({ activeFilters = {}, filtersSchema = {}, closeBttn, onFilterChange }) {
	// const initialActiveFilters = Object.keys(filterGroups).reduce((o, k) => ({...o, [k]: []}), {});
	const [openedFilter, setOpenedFilter] = useState(null);

	useEffect(() => {
		onFilterChange(activeFilters);
	}, [activeFilters]);

	const clickToggle = (e) => {
		const { group } = e.target.dataset;
		setOpenedFilter(group === openedFilter ? null : group);
	};

	const onChangeCheckbox = (e) => {
		const { group, value } = e.target.dataset;
		const groupData = activeFilters.hasOwnProperty(group) ? activeFilters[group] : [];
		const valueIndex = groupData.indexOf(value);
		const newFilters = valueIndex > -1 ? groupData.filter(f => f !== value) : [...groupData, value];

		if(newFilters.length) {
			onFilterChange({...activeFilters, [group]: newFilters });
		} else {
			delete activeFilters[group];
			onFilterChange({...activeFilters});
		}
	};

	const onClickClear = (e) => {
		delete activeFilters[e.target.value];
		onFilterChange({...activeFilters});
	}

	const onClickClearAll = () => {
		onFilterChange({});
	}

	const onClickEnableAll = () => {
		onFilterChange(Object.fromEntries(
			Object.keys(filtersSchema).map(key => (
		  	[key, filtersSchema[key].options.reduce((prev, curr) => [...prev, curr.key], [])]
			))
		));
	}

	return (
		<>
			<header className="flex p-4">
				<h2 className="py-1">
					<strong>Data Filters</strong>
				</h2>
				<button
					className="border rounded px-2 py-1 ml-2"
					onClick={onClickClearAll}>
					Clear All
				</button>
				<button
					className="border rounded px-2 py-1 ml-2"
					onClick={onClickEnableAll}>
					Enable All
				</button>
				{closeBttn}
			</header>

			<div className="border-t">
				{Object.keys(filtersSchema).map(key => (
					<Accordion
						key={key}
						group={key}
						schema={filtersSchema[key]}
						activeFilters={activeFilters}
						onChange={onChangeCheckbox} />
				))}
			</div>
		</>
	)
}