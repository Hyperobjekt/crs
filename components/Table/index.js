import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

export default function Table({ tableData = [] }) {

	const [activities, setActivities] = useState([]);
	const [currSort, setCurrSort] = useState({});
	const [limit, setLimit] = useState(500);

	useEffect(() => {
		setActivities(tableData.filter((row, index) => index < limit));
	}, [tableData]);

	const fieldTitles = {
		"Title/Summary": {
			size: "w-4/12",
			sortable: false,
		},
		"Date Intro": {
			size: "w-1/12",
			sortable: true,
		},
		"State/US": {
			size: "w-1/12",
			sortable: true,
		},
		"Level": {
			size: "w-1/12",
			sortable: true,
		},
		"Authority Type": {
			size: "w-2/12",
			sortable: true,
		},
	};

	const onHeaderClick = (colKey) => {
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
	}

	const ColHeaderElem = ({ colKey, index }) => {
		return (
			<th
				scole="col"
				role="colheader"
				colSpan="1"
				className={`${fieldTitles[colKey].size} flex py-5 text-left text-xs cursor-pointer`}
				tabIndex={0}
				onClick={() => onHeaderClick(colKey)}>
				
				<div className="">
					{getText(colKey)}
				</div>

				{fieldTitles[colKey].sortable ?
					<div className="w-2 flex flex-col mb-auto ml-2">
						<div
							className="w-2 h-2"
							style={{ opacity: currSort.key === colKey && currSort.dir === "desc" ? 1 : 0.5 }}>
							<img
								src="/IconArrowSort.svg"
								alt=""
								width={8}
								height={8} />
						</div>
						<div
							className="w-2 h-2"
							style={{ opacity: currSort.key === colKey && currSort.dir === "asc" ? 1 : 0.5 }}>
							<img
								src="/IconArrowSort.svg"
								alt=""
								width={8}
								height={8}
								className="rotate-180" />
						</div>
					</div>
				: null}

			</th>
		);
	};

	const RowElem = ({ rowData, index }) => {
		const bgColor = index % 2 ? "bg-slate-50" : "bg-white";
		return(
			<tr
				role="row"
				className={`flex ${bgColor} px-4 space-x-4 border-b`}>
				{Object.keys(fieldTitles).map((t,i) => <ColElem key={i} colKey={t} colVal={rowData[t]} index={index} />)}
			</tr>
		)
	};

	const ColElem = ({ colKey, colVal, index }) => {
		return(
			<td
				role="cell"
				className={`${fieldTitles[colKey].size} py-4`}>
				{getText(colKey) ?
					colKey ==="Date Intro" ? getDate(colVal) : getText(colVal) 
					: <a href="#" target="_blank" className="w-full block border rounded-md px-1 py-1 text-center">
						{getText(colKey)}
					</a>
				}
			</td>
		)
	};

	// const filterTable = (row) => {
	// 	const activeGroups = Object.keys(filterData).filter((groupKey) => filterData[groupKey].length);
	// 	const activeOptions = activeGroups.filter((groupKey) => filterData[groupKey].includes(row[groupKey]));
	// 	return activeGroups.length > activeOptions.length ? 0 : 1;
	// };

	return (
		<table
			className="w-full h-full block table-fixed overflow-scroll">
			<thead className="sticky top-0 bg-white">
				<tr
					className="flex space-x-4 px-4 border-b">
					{Object.keys(fieldTitles).map((colKey, index) => <ColHeaderElem key={index} colKey={colKey} index={index} />)}
				</tr>
			</thead>
			<tbody>
				{activities.map((rowData, index) => <RowElem key={index} rowData={rowData} index={index} />)}
			</tbody>
		</table>
	)
}