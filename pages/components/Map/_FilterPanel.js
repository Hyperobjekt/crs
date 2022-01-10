import { useEffect, useState, useRef } from "react";

// import CloseBttn from "../Icon/_CloseBttn";
import Accordion from "./_Accordion";

const filterGroups = {
	"Authority Type": {
		label: "Authority Type",
		options: [
			"Legislation",
			"Exec directive",
			"Resolution",
			"Other",
		]
	},
	"Level": {
		label: "Level",
		options: [
			"LocalOth",
			"LocalSch",
		]
	}
};

export default function FilterPanel({ closeBttn, onFilterChange }) {
	// const initialActiveFilters = Object.keys(filterGroups).reduce((o, k) => ({...o, [k]: []}), {});
	const [openedFilter, setOpenedFilter] = useState(null);
	const [activeFilters, setActiveFilters] = useState({});

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
			setActiveFilters({...activeFilters, [group]: newFilters });
		} else {
			delete activeFilters[group];
			setActiveFilters({...activeFilters});
		}
	};

	const onClickClear = (e) => {
		delete activeFilters[e.target.value];
		setActiveFilters({...activeFilters});
	}

	const onClickClearAll = () => {
		setActiveFilters({});
	}

	return (
		<>
			{Object.keys(activeFilters).length ?
				<div id="applied-filters"
					className="w-full h-16 absolute left-0 -top-16 z-20 bg-white border-b p-4">
					<span>Applied Fiters:</span>
					{Object.keys(activeFilters).map(key => (
						<button
							key={key}
							value={key}
							className="text-slate-600 bg-slate-200 rounded-full px-4 py-1 mr-2"
							onClick={onClickClear}>
							{key}: {activeFilters[key].map((o, i) => `${o}${i < activeFilters[key].length - 1 ? ", " : ""}`)}
						</button>
					))}
				</div>
			: null}

			<div className="flex p-4">
				<strong className="py-1">
					Data Filters
				</strong>
				<button
					className="border rounded px-2 py-1 ml-2"
					onClick={onClickClearAll}>
					Clear All
				</button>
				<button
					className="border rounded px-2 py-1 ml-2"
					onClick={null}>
					Enable All
				</button>

				{closeBttn}
			</div>

			<div className="border-t">
				{Object.keys(filterGroups).map(key => (
					<Accordion
						key={key}
						group={filterGroups[key]}
						activeFilters={activeFilters}
						onChange={onChangeCheckbox} />
				))}
			</div>
		</>
	)
}