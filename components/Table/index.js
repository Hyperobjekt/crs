import { useEffect, useState, useRef } from "react";

import { getText, getDate } from "./../../helpers";

import HeaderCell from "./_HeaderCell";
import BodyCell from "./_BodyCell";
import { Button, ButtonExt } from "./../Utils";

export default function Table({ filteredActivities = [], setActiveActivity, schema }) {

	const [activities, setActivities] = useState([]);
	const [sort, setSort] = useState({});
	const [limit, setLimit] = useState(500);

	const colKeys = Object.keys(schema).filter(key => schema[key].table);

	useEffect(() => {
		setSort({
			key: "Summary Status",
			order: "asc",
			type: "string"
		});
	}, []);

	useEffect(() => {
		const sortedActivities = [ ...filteredActivities ].sort((a, b) => {
			let aVal = a[sort.key];
			let bVal = b[sort.key];

			if(sort.type === "date") {
				aVal = new Date(a[sort.key]);
				bVal = new Date(b[sort.key]);
			}

			if(aVal < bVal) return sort.order === "asc" ? -1 : 1;
			if(aVal > bVal) return sort.order === "asc" ? 1 : -1;

			return 0;
		});
		setActivities(prevActivities => [ ...sortedActivities ]);
	}, [filteredActivities, sort]);


	const onHeaderClick = (key, type) => { 
		setSort({
			key: key,
			type: type,
			order: sort.order === "asc" ? "desc" : "asc"
		});
	};

	const onButtonClick = (rowData) => {
		setActiveActivity(rowData);
	}

	return (
		<div className="w-full h-full overflow-x-scroll">
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
								sort={sort}
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
				<tbody className="overflow-y-scroll">
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
									onClick={() => onButtonClick(rowData)}>
									Read more
								</Button>
							</BodyCell>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}