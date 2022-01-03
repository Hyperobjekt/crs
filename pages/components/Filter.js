import { useEffect, useState, useRef } from "react";

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
			"Federal",
			"State",
			"LocalOth",
			"LocalSch",
		]
	}
};

export default function Filter({ onFilterChange }) {
	const initialFilterData = Object.keys(filterGroups).reduce((o, k) => ({...o, [k]: []}), {});
	const [openedFilter, setOpenedFilter] = useState(null);
	const [filterData, setFilterData] = useState(initialFilterData);

	useEffect(() => {
		onFilterChange(filterData);
	}, [filterData]);

	const clickToggle = (e) => {
		const { group } = e.target.dataset;
		setOpenedFilter(group === openedFilter ? null : group);
	};

	const filterGroupElem = (filterGroupKey) => {
		const filterGroup = filterGroups[filterGroupKey];
		return(
			<div
				key={filterGroupKey}
				className="relative">
				<button
					data-group={filterGroupKey}
					onClick={clickToggle}
					className="border rounded-md px-2 py-1 mr-2">
					{filterGroup.label}
				</button>
				{openedFilter === filterGroupKey ?
					<div
						role="listbox"
						aria-multiselectable="true"
						className="w-48 absolute top-full bg-white border rounded-md px-2 py-1 mr-2 mt-3">
						{filterGroup.options.map((val, key) => filterOptionElem(val, key, filterGroupKey))}
					</div>
				: null}
			</div>
		);
	};

	const clickOption = (e) => {
		const { group, value } = e.target.dataset;
		const groupData = filterData.hasOwnProperty(group) ? filterData[group] : [];
		const valueIndex = groupData.indexOf(value);
		const newFilters = valueIndex > -1 ? groupData.filter(f => f !== value) : [...groupData, value];
		setFilterData({...filterData, [group]: newFilters });
	};

	const filterOptionElem = (filterVal, filterKey, filterGroupKey) => {
		const inputId = `${filterGroupKey}_${filterVal}`;
		return(
			<div key={filterKey}>
				<input
					type="checkbox"
					role="option"
					id={inputId}
					value={filterVal}
					data-group={filterGroupKey}
					data-value={filterVal}
					aria-selected={filterData[filterGroupKey].includes(filterVal)}
					tabIndex={0}
					onClick={clickOption}
					// style={{ opacity: filterData[filterGroupKey].includes(filterVal) ? 1 : 0.5}}
					className="cursor-pointer" />
				<label
					htmlFor={inputId}
					className="pl-2 cursor-pointer">
					{filterVal}
				</label>
			</div>
		);
	};

	return (
		<div
			id="filters"
			className="border-b p-4 flex">
			{Object.keys(filterGroups).map(key => filterGroupElem(key))}
		</div>
	)
}