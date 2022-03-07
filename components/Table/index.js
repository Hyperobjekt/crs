import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

import HeaderCell from "./_HeaderCell";
import BodyRow from "./_BodyRow";
import ButtonExt from "./../Global/_ButtonExt";

export default function Table({ filteredData = [] }) {

	const [activities, setActivities] = useState([]);
	const [currSort, setCurrSort] = useState({});
	const [limit, setLimit] = useState(500);

	useEffect(() => {
		setActivities(filteredData.filter((row, index) => index < limit));
	}, [filteredData]);

	const colSchemas = [
		{
			key: "Date Intro",
			className: "w-2/12",
			colSpan: 2,
			sortable: true,
		},
		{
			key: "State/US",
			className: "w-1/12",
			colSpan: 1,
			sortable: true,
		},
		{
			key: "Summary Status",
			className: "w-1/12",
			colSpan: 1,
			sortable: true,
		},
		{
			key: "Level",
			className: "w-2/12",
			colSpan: 2,
			sortable: true,
		},
		{
			key: "Authority Type",
			className: "w-2/12",
			colSpan: 2,
			sortable: true,
		},
		{
			key: "Status (link)",
			className: "w-2/12",
			colSpan: 2,
			button: true,
		},
		{
			key: "Full text (link)",
			className: "w-2/12",
			colSpan: 2,
			button: true,
		}
	];

	const onHeaderClick = (colKey) => {
		// if(!colSchemas[colKey].sortable) return;
		const newDir = currSort.dir === "asc" ? "desc" : "asc";
		const sortedActivities = [ ...activities ].sort((a, b) => {
			let aVal = a[colKey];
			let bVal = b[colKey];

			if(colKey === "Date Intro") {
				aVal = new Date(a[colKey]);
				bVal = new Date(b[colKey]);
			}

			if(aVal < bVal) return newDir === "asc" ? 1 : -1;
			if(aVal > bVal) return newDir === "asc" ? -1 : 1;

			return 0;
		});

		setActivities(prevActivities => [ ...sortedActivities ]);

		setCurrSort({
			key: colKey,
			dir: newDir
		});
	};

	// const filterTable = (row) => {
	// 	const activeGroups = Object.keys(filterData).filter((groupKey) => filterData[groupKey].length);
	// 	const activeOptions = activeGroups.filter((groupKey) => filterData[groupKey].includes(row[groupKey]));
	// 	return activeGroups.length > activeOptions.length ? 0 : 1;
	// };

	return (
		<table
			className="w-full h-full min-w-[70rem] flex flex-col table-fixed relative">
			<thead className="bg-white sticky">
				<tr
					className="flex space-x-2 px-4 border-b">
					{colSchemas.map((colSchema, index) => (
						<HeaderCell key={index} index={index} colSchema={colSchema} currSort={currSort} onHeaderClick={onHeaderClick} />
					))}
				</tr>
			</thead>
			<tbody className="overflow-scroll">
				{activities.map((rowData, index) => (
					rowData["State/US"] ?
						<BodyRow key={index} index={index} rowData={rowData} colSchemas={colSchemas} />
					: null
				))}
			</tbody>
		</table>
	)
}