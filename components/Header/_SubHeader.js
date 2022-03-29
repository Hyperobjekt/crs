import { useState } from "react";
import { getText, getDate } from "../../helpers";
import { Button } from "../Utils";

export default function AppliedFilters({ filterOpen, activeFilters = {}, activityCount, onFilterChange, onFilterPanelToggle, onViewClick }) {
	const [activeView, setActiveView] = useState("map");

	const onClickApplied = (e) => {
		const { key, value } = e.target.dataset;
		if(!key || !value) return;
		const newActiveFilters = { ...activeFilters };
		newActiveFilters[key].splice(newActiveFilters[key].indexOf(value), 1);
		if(newActiveFilters[key].length <= 0) delete newActiveFilters[key];
		onFilterChange(newActiveFilters);
	};

	const onClickClear = () => {
		onFilterChange({});
	};

	const onClickView = (e) => {
		const view = e.target.value;
		setActiveView(view);
		onViewClick(view);
	}

	return (
		<div className="w-full flex flex-wrap relative z-50 bg-white border-b whitespace-nowrap shadow">

			<div className="p-4 sm:pr-0 flex items-center">
				<Button
					className={filterOpen ? "button-active" : ""}
					imgSrc={`IconFilter${filterOpen ? "Blue" : ""}.svg`}
					onClick={onFilterPanelToggle}>
					Filters
				</Button>
			</div>
			<div className="sm:flex-1 relative overflow-x-hidden order-3 sm:order-none">
				<div className="h-full flex gap-2 p-4 overflow-x-scroll">
					{Object.keys(activeFilters).map(key => (
						activeFilters[key].length ?
							<div key={key} className="flex gap-2 items-center">
								<span className="my-auto">
									{getText(key)}:
								</span>
								{activeFilters[key].map((val, i) => {
									const label = key === "Date Intro" ? getDate(val) : getText(val);
									return(
										val ?
											<div
												key={i}
												role="button"
												data-key={key}
												data-value={val}
												title={label}
												className="button max-w-xs rounded-full relative pr-8 overflow-hidden bg-gray-blue-200 text-dark-blue select-none"
												onClick={onClickApplied}>
												{label}
												<div className="w-3 h-full absolute right-5 top-0 bg-gradient-to-l from-gray-blue-200 pointer-events-none"></div>
												<div className="w-5 h-full flex absolute right-0 -top-0.5 bg-gray-blue-200 pointer-events-none">
													<div className="my-auto text-lg">&times;</div>
												</div>
											</div>
										: null
									)
								})}
							</div>
						: null
					))}
					{Object.keys(activeFilters).length ?
						<div className="flex items-center">
							<button
								className="button"
								onClick={onClickClear}>
								Clear all
							</button>
						</div> :
						<div className="my-auto whitespace-normal">
							This map displays <strong className="text-accent-blue">{activityCount}</strong> anti-CRT efforts introduced at the local, state, and federal levels.
						</div>
					}
				</div>
				<div className="w-6 h-full absolute left-0 top-0 bg-gradient-to-r from-white pointer-events-none"></div>
				<div className="w-6 h-full absolute right-0 top-0 bg-gradient-to-l from-white pointer-events-none"></div>
			</div>

			<div className="p-4 pl-0 flex items-center ml-auto">
				{/*<Button
					// className="mr-3"
					imgSrc={`Icon${activeView === "map" ? "Table" : "Map"}.svg`}
					onClick={() => onViewClick(activeView === "map" ? "table" : "map")}>
					{activeView === "map" ? "Table" : "Map"}
				</Button>*/}
				<Button
					className={`${activeView === "map" ? "button-active" : ""} rounded-r-none`}
					imgSrc={`IconMap.svg`}
					value="map"
					onClick={onClickView}>
					Map
				</Button>
				<Button
					className={`${activeView === "table" ? "button-active" : ""} rounded-l-none -ml-1`}
					imgSrc={`IconTable.svg`}
					value="table"
					onClick={onClickView}>
					Table
				</Button>
			</div>
		</div>
	)
}