import { useEffect, useState, useRef } from "react";

import getText from "./../../helpers/getText";

import Accordion from "./_Accordion";
import Filter from "./_Filter";

export default function FilterPanel({ activeCount, activeFilters = {}, filtersSchema = {}, onFilterChange, closeBttn }) {
	const [openedFilter, setOpenedFilter] = useState(null);

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
			Object.keys(filtersSchema).map(key => (
		  	[key, filtersSchema[key].options.reduce((prev, curr) => [...prev, curr], [])]
			))
		));
	}

	return (
		<>
			<header className="p-4">
				<div className="flex">
					<h2 className="text-xl font-bold">
						Data Filters
					</h2>
					{closeBttn}
				</div>
				<div className="flex gap-2 mt-6">
					<button
						className="button"
						onClick={onClickClearAll}>
						Clear All
					</button>
					<button
						className="button"
						onClick={onClickEnableAll}>
						Enable All
					</button>
				</div>
			</header>

			<div className="overflow-y-scroll pb-16">

				<div className="px-4 py-4">
					{/*This map displays {activeCount} places in the USA where people are trying to implement laws against teaching Critical Race Theory. Filter results by:*/}
					Filter results by:
				</div>

				<div>
					{Object.keys(filtersSchema).map(key => (
						<Accordion
							key={key}
							open={true}
							label={getText(key)}>
							<Filter
								group={key}
								schema={filtersSchema[key]}
								activeFilters={activeFilters}
								onChange={onChangeFilters}	/>
						</Accordion>
					))}
				</div>

			</div>
		</>
	)
}