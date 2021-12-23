import { useEffect, useState, useRef } from "react";
import Filter from "./Filter";

export default function Table({ filterData = {}, tableData = [] }) {

	const fieldTitles = {
		"Title/Summary": "Title",
		"Body Name": "Body Name",
		"State/US": "State",
		"Level": "Level of government involved",
		"Authority Type": "Type of action involved",
		"Date Intro": "Date initiated",
	};

	const colHeaderElem = (colKey, i) => {
		return <td key={i}>{fieldTitles[colKey]}</td>
	}

	const rowElem = (rowData, i) => {
		return(
			<tr key={i}
				style={{ background: i % 2 ? "#eee" : "#ccc" }}>
				{Object.keys(fieldTitles).map((t,i) => colElem(rowData[t],i))}
			</tr>
		)
	};

	const colElem = (colData, i) => {
		return(
			<td key={i}
				style={{ padding: 5 }}>
				{colData}
			</td>
		)
	};

	const filterTable = (row) => {
		const activeGroups = Object.keys(filterData).filter((groupKey) => filterData[groupKey].length);
		const activeOptions = activeGroups.filter((groupKey) => filterData[groupKey].includes(row[groupKey]));
		return activeGroups.length > activeOptions.length ? 0 : 1;
	};

	return (
		<table style={{ padding: 20, paddingTop: 50, overflow: "scroll" }}>
			<thead>
				<tr>
					{Object.keys(fieldTitles).map(colHeaderElem)}
				</tr>
			</thead>
			<tbody>
				{tableData.filter(filterTable).map(rowElem)}
			</tbody>
		</table>
	)
}