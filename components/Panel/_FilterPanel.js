import { useEffect, useState, useRef } from "react";

import { getText } from "../../helpers";

import { Button } from "../Utils";
import Accordion from "./_Accordion";
import Filter from "./_Filter";

export default function FilterPanel({
	activeCount,
	activeFilters = {},
	schema = {},
	onFilterChange,
	closeBttn,
}) {
	const [openedFilter, setOpenedFilter] = useState(null);
	const parentRef = useRef(null);

	const filterKeys = Object.keys(schema).filter((key) => schema[key].filter);

	useEffect(() => {
		onFilterChange(activeFilters);
	}, [activeFilters]);

	const clickToggle = (e) => {
		const { group } = e.target.dataset;
		setOpenedFilter(group === openedFilter ? null : group);
	};

	const onChangeFilters = (newFilters) => {
		onFilterChange(newFilters);
	};

	const onClickClear = (e) => {
		delete activeFilters[e.target.value];
		onFilterChange({...activeFilters});
	}

	const onClickClearAll = () => {
		onFilterChange({});
	}

	const onClickEnableAll = () => {
		onFilterChange(Object.fromEntries(
			Object.keys(schema)
				.filter(key => schema[key].filter && schema[key].filter.options)
				// .map(key => {
			 //  	[key, schema[key].filter.options.reduce((prev, curr) => console.log(curr.key ?))]
				// })
				.map(key => (
			  	[key, schema[key].filter.options.reduce((prev, curr) => [...prev, typeof curr === "object" ? curr.key : curr], [])]
				))
		));
	}

	return (
		<>
			<header className="p-4 border-b">
				<div className="flex">
					<h2 className="type-heading-1">
						Data Filters
					</h2>
					{closeBttn}
				</div>
			</header>
			
			<div className="overflow-hidden relative">
				<div className="h-full overflow-hidden overflow-y-scroll pt-6 pb-16" ref={parentRef}>
					<div className="flex gap-2 px-4">
						<div>
							<Button
								onClick={onClickClearAll}>
								Clear All
							</Button>
						</div>
						<div>
							<Button
								onClick={onClickEnableAll}>
								Enable All
							</Button>
						</div>
					</div>
					<div className="p-4">
						Filter results by:
					</div>
					<div>
						{filterKeys.map(key => (
							<Accordion
								key={key}
								open={true}
								label={getText(key)}
								tooltip={schema[key].tooltip}>
								<Filter
									group={key}
									schema={schema[key]}
									activeFilters={activeFilters}
									parent={parentRef.current}
									onChange={onChangeFilters}	/>
							</Accordion>
						))}
					</div>
				</div>
			</div>
		</>
	)
}