import { useEffect, useState, useRef } from "react";

export default function Table({ tableData = [] }) {

	const fieldTitles = {
		"Title/Summary": {
			title: "Title",
			size: "w-4/12"
		},
		// "Body Name": {
		// 	title: "Body Name",
		// 	size: "w-2/12"
		// },
		"Date Intro": {
			title: "Date initiated",
			size: "w-1/12"
		},
		"State/US": {
			title: "State",
			size: "w-1/12"
		},
		"Level": {
			title: "Level of government involved",
			size: "w-1/12"
		},
		"Authority Type": {
			title: "Type of activity involved",
			size: "w-1/12"
		},
		"See Status": {
			size: "w-2/12"
		},
		"Read Full Text": {
			size: "w-2/12"
		}
	};

	const colSpanElem = (colKey, i) => {
		return (
			<col key={i}
				span="1"
				// style={{maxWidth: "10%"}}
				className={`${fieldTitles[colKey].size}`} />
		);
	};

	const colHeaderElem = (colKey, i) => {
		return (
			<th key={i}
				scole="col"
				role="colheader"
				colSpan="1"
				// style={{maxWidth: "10%"}}
				// className="p-5"
				className={`${fieldTitles[colKey].size} p-5 text-left`}>
				{fieldTitles[colKey].title}
			</th>
		);
	};

	const rowElem = (rowData, i) => {
		const bgColor = i % 2 ? "bg-slate-50" : "bg-white";
		return(
			<tr key={i}
				role="row"
				className={`flex ${bgColor} border-b`}>
				{Object.keys(fieldTitles).map((t,i) => colElem(rowData[t], i))}
			</tr>
		)
	};

	const colElem = (colData, i) => {
		const colKey = Object.keys(fieldTitles)[i];
		return(
			<td key={i}
				role="cell"
				// style={{maxWidth: "10%"}}
				className={`${fieldTitles[colKey].size} p-5`}>
				{fieldTitles[colKey].title ? colData : <a href="#" target="_blank" className="w-full block border rounded-md px-2 py-1 mr-2 text-center">{colKey}</a>}
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
			{/*<colgroup>
				{Object.keys(fieldTitles).map(colSpanElem)}
	    </colgroup>*/}
			<thead className="sticky bg-white">
				<tr className="flex border-b">
					{Object.keys(fieldTitles).map(colHeaderElem)}
				</tr>
			</thead>
			<tbody>
				{/*{tableData.filter(filterTable).map(rowElem)}*/}
				{tableData.map(rowElem)}
			</tbody>
		</table>
	)
}