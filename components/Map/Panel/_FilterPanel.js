import { useEffect, useState, useRef } from "react";

import getText from "./../../../helpers/getText";

import Accordion from "./_Accordion";
import Filter from "./_Filter";

export default function FilterPanel({ activeCount, activeFilters = {}, filtersSchema = {}, closeBttn, onFilterChange }) {
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
		  	[key, filtersSchema[key].options.reduce((prev, curr) => [...prev, curr], [])]
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

			<div className="px-4 pb-4">
				This map displays {activeCount} places in the USA where people are trying to implement laws against teaching Critical Race Theory. Filter results by:
			</div>

			<div className="border-t">
				{Object.keys(filtersSchema).map(key => (
					<Accordion
						key={key}
						open={true}
						label={getText(key)}>
						<Filter
							group={key}
							schema={filtersSchema[key]}
							activeFilters={activeFilters}
							onChange={onChangeCheckbox}	/>
					</Accordion>
				))}
			</div>
		</>
	)
}