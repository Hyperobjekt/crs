import { useEffect, useState, useRef } from "react";

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

	const onClickCheckbox = (e) => {
		const { group, value } = e.target.dataset;
		const groupData = filterData.hasOwnProperty(group) ? filterData[group] : [];
		const valueIndex = groupData.indexOf(value);
		const newFilters = valueIndex > -1 ? groupData.filter(f => f !== value) : [...groupData, value];
		setFilterData({...filterData, [group]: newFilters });
	};

	return (
		<div
			id="filters"
			className="w-80 h-full absolute left-0 top-0 z-10 bg-white border-r">
			{Object.keys(filterGroups).map(key => (
				<Accordion
					key={key}
					group={filterGroups[key]}
					onClick={onClickCheckbox} />
			))}
		</div>
	)
}