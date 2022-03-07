import getText from "./../helpers/getText";
import Button from "./Global/_Button";

export default function AppliedFilters({ filterOpen, activeFilters = {}, onFilterChange, onFilterPanelToggle }) {

	const onClickApplied = (e) => {
		const { key, value } = e.target.dataset;
		const newActiveFilters = { ...activeFilters };
		newActiveFilters[key].splice(newActiveFilters[key].indexOf(value), 1);
		if(newActiveFilters[key].length <= 0) delete newActiveFilters[key];
		onFilterChange(newActiveFilters);
	};

	const onClickClear = () => {
		onFilterChange({});
	};

	return (
		<div className="w-full flex relative z-20 bg-white border-b whitespace-nowrap shadow">

			<div className="p-4 pr-0">
				<Button
					style={filterOpen ? "blue" : ""}
					imgSrc={`IconFilter${filterOpen ? "Blue" : ""}.svg`}
					onClick={onFilterPanelToggle}>
					Filters
				</Button>
			</div>
			<div className="relative">
				<div className="flex gap-2 p-4 px-8 overflow-x-scroll">
					{Object.keys(activeFilters).map(key => (
						activeFilters[key].length ?
							<div key={key} className="flex gap-2">
								<span className="my-auto">
									{getText(key)}:
								</span>
								{activeFilters[key].map((val, i) => (
									val ?
										<button
											key={i}
											data-key={key}
											data-value={val}
											className="button rounded-full bg-gray-blue-200 text-dark-blue"
											onClick={onClickApplied}>
											{getText(val)} &times;
										</button>
									: null
								))}
							</div>
						: null
					))}
					{Object.keys(activeFilters).length ?
						<button
							className="button"
							onClick={onClickClear}>
							Clear all
						</button>
					: null}
				</div>
				<div className="w-8 h-full absolute left-0 top-0 bg-gradient-to-r from-white pointer-events-none"></div>
			</div>
			<div className="w-8 h-full absolute right-0 top-0 bg-gradient-to-l from-white pointer-events-none"></div>
		</div>
	)
}