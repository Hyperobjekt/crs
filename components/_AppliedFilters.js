import { getText, getDate } from "./../helpers";
import Button from "./Global/_Button";

export default function AppliedFilters({ filterOpen, activeFilters = {}, onFilterChange, onFilterPanelToggle }) {

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

	return (
		<div className="w-full h-20 flex relative z-50 bg-white border-b whitespace-nowrap shadow">

			<div className="p-4 pr-0 flex items-center">
				<Button
					className={filterOpen ? "button-active" : ""}
					imgSrc={`IconFilter${filterOpen ? "Blue" : ""}.svg`}
					onClick={onFilterPanelToggle}>
					Filters
				</Button>
			</div>
			<div className="relative overflow-x-hidden">
				<div className="h-full flex gap-2 p-4 px-6 overflow-x-scroll">
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
						</div>
					: null}
				</div>
				<div className="w-6 h-full absolute left-0 top-0 bg-gradient-to-r from-white pointer-events-none"></div>
			</div>
			<div className="w-6 h-full absolute right-0 top-0 bg-gradient-to-l from-white pointer-events-none"></div>
		</div>
	)
}