import { useEffect, useState, useRef } from "react";

import { getText } from "../../helpers";

import Button from "../Global/_Button";
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
			<header className="p-4 border-b">
				<div className="flex">
					<h2 className="type-heading-1">
						Data Filters
					</h2>
					{closeBttn}
				</div>
			</header>
			
			<div className="overflow-hidden relative">
				<div className="h-full overflow-y-scroll pt-6 pb-16">
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
				{/*<div className="w-full h-6 absolute left-0 top-0 bg-gradient-to-b from-white pointer-events-none" />*/}
			</div>
		</>
	)
}