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
	const [filterData, setFilterData] = useState(initialFilterData);

	useEffect(() => {
		onFilterChange(filterData);
	}, [filterData]);

	const clickFilter = (e) => {
		const { group, value } = e.target.dataset;
		const groupData = filterData.hasOwnProperty(group) ? filterData[group] : [];
		const valueIndex = groupData.indexOf(value);
		const newFilters = valueIndex > -1 ? groupData.filter(f => f !== value) : [...groupData, value];
		setFilterData({...filterData, [group]: newFilters });
	};

	const filterOptionElem = (filterVal, filterKey, filterGroupKey) => {
		return(
			<button
				key={filterKey}
				role="option"
				data-group={filterGroupKey}
				data-value={filterVal}
				aria-selected={filterData[filterGroupKey].includes(filterVal)}
				style={{opacity: filterData[filterGroupKey].includes(filterVal) ? 1 : 0.5 }}
				tabIndex={0}
				onClick={clickFilter}>
				{filterVal}
			</button>
		);
	};

	const filterGroupElem = (filterGroupKey) => {
		const filterGroup = filterGroups[filterGroupKey];
		return(
			<div
				key={filterGroupKey}
				role="listbox"
				aria-multiselectable="true">
				<label>{`${filterGroup.label}: `}</label>
				{filterGroup.options.map((val, key) => filterOptionElem(val, key, filterGroupKey))}
			</div>
		);
	};

	return (
		<div
			id="filters"
			style={{ padding: 20, position: "sticky", top: 0, background: "white" }}>
			{Object.keys(filterGroups).map(key => filterGroupElem(key))}
		</div>
	)
}