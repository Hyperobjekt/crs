import React, { useEffect, useState, useRef } from "react";

import Row from "./_row";

import tableData from "../../data/table";

export default function Table() {
	const levels = Object.keys(tableData);
	const [activeLevel, setActiveLevel] = useState(levels[0]);

	const fieldTitles = {
		"Title/Summary": "Title",
		"Body Name": "Body Name",
		"State/US": "State",
		"Level": "Level of government involved",
		"Bill #": "Bill #",
		"Authority Type": "Type of action involved",
		"Date Intro": "Date initiated",
	};

	useEffect(() => {
		
	}, []);

	const changeLevel = (e) => {
		setActiveLevel(e.target.value);
	};

	const levelToggleElem = (level) => {
		if(!level) return;
		return(
			<span key={level}>
				<input
					style={{ cursor: "pointer", margin: 0 }}
					type="radio"
					name="view"
					id={level}
					value={level}
					checked={level === activeLevel}
					onChange={changeLevel} />
				<label
					style={{ cursor: "pointer", padding: 5 }}
					htmlFor={level}>
					{level}
				</label>
			</span>
		);
	}

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
	}

	return (
		<>
			<form style={{ position: "fixed", top: 0, right: 0, padding: 20 }}>
				{levels.map(levelToggleElem)}
			</form>

			<table style={{ padding: 20, paddingTop: 50, overflow: "scroll" }}>
				<thead>
					<tr>
						{Object.keys(fieldTitles).map(colHeaderElem)}
					</tr>
				</thead>
				<tbody>
					{tableData[activeLevel].map(rowElem)}
				</tbody>
			</table>
		</>
	)
}