import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

import HeaderCell from "./_HeaderCell";
import BodyRow from "./_BodyRow";
import ButtonExt from "./../Global/_ButtonExt";

export default function Table({ tableData = [] }) {

	const [activities, setActivities] = useState([]);
	const [currSort, setCurrSort] = useState({});
	const [limit, setLimit] = useState(500);

	useEffect(() => {
		setActivities(tableData.filter((row, index) => index < limit));
	}, [tableData]);

	const colSchemas = [
		{
			key: "Title/Summary",
			className: "py-4 w-4/12",
			colSpan: 4,
			sortable: false,
		},
		{
			key: "Date Intro",
			className: "py-4 w-1/12",
			colSpan: 1,
			sortable: true,
		},
		{
			key: "State/US",
			className: "py-4 w-1/12",
			colSpan: 1,
			sortable: true,
		},
		{
			key: "Level",
			className: "py-4 w-1/12",
			colSpan: 1,
			sortable: true,
		},
		{
			key: "Authority Type",
			className: "py-4 w-1/12",
			colSpan: 1,
			sortable: true,
		},
		{
			key: "Status (link)",
			className: "py-4 w-2/12",
			colSpan: 2,
			button: true,
		},
		{
			key: "Full text (link)",
			className: "py-4 w-2/12",
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
					className="flex space-x-4 px-4 border-b">
					{colSchemas.map((colSchema, index) => (
						<HeaderCell key={index} index={index} colSchema={colSchema} currSort={currSort} />
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