import { useEffect, useState, useRef } from "react";

import { getText, getDate } from "./../../helpers";

import HeaderCell from "./_HeaderCell";
import BodyCell from "./_BodyCell";
import Button from "./../Global/_Button";
import ButtonExt from "./../Global/_ButtonExt";

export default function Table({ filteredActivities = [], setActiveActivity, schema }) {

	const [activities, setActivities] = useState([]);
	const [currSort, setCurrSort] = useState({});
	const [limit, setLimit] = useState(500);

	const colKeys = Object.keys(schema).filter(key => schema[key].table);

	useEffect(() => {
		setActivities(filteredActivities.filter((row, index) => index < limit));
	}, [filteredActivities]);

	const onHeaderClick = (key, type) => {
		const newDir = currSort.dir === "asc" ? "desc" : "asc";
		const sortedActivities = [ ...activities ].sort((a, b) => {
			let aVal = a[key];
			let bVal = b[key];

			if(type === "date") {
				aVal = new Date(a[key]);
				bVal = new Date(b[key]);
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

	const onButtonClick = () => {
		setActiveActivity(rowData);
	}

	return (
		<table
			className="w-full h-full min-w-[70rem] flex flex-col table-fixed relative">
			<thead className="bg-white sticky z-50">
				<tr
					className="flex px-4 space-x-2 border-b">
					{colKeys.map((key, index) => (
						<HeaderCell
							key={index}
							colKey={key}
							colSchema={schema[key]}
							currSort={currSort}
							onHeaderClick={onHeaderClick} />
					))}
					<th
						scole="col"
						role="colheader"
						colSpan="2"
						style={{
							width: `${2/12 * 100}%`
						}}/>
				</tr>
			</thead>
			<tbody className="overflow-scroll">
				{activities.map((rowData, index) => (
					<tr
						key={index}
						role="row"
						className={index % 2 ? "body-row flex px-4 py-6 space-x-2 bg-gray-100" : "body-row flex px-4 py-6 space-x-2 bg-white"}>
						{colKeys.map(key => (
							<BodyCell
								key={key}
								colVal={rowData[key]}
								colSchema={schema[key]}>
							</BodyCell>
						))}
						<BodyCell
							colSchema={{table:{col:2}}}>
							<Button
								onClick={onButtonClick}>
								Read more
							</Button>
						</BodyCell>
					</tr>
				))}
			</tbody>
		</table>
	)
}