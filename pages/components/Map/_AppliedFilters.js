export default function AppliedFilters({activeFilters, onFilterChange}) {

	const onClickApplied = (e) => {
		const {[0]: key, [1]: val} = e.target.value.split(":");
		const newActiveFilters = {...activeFilters};
		newActiveFilters[key].splice(newActiveFilters[key].indexOf(val), 1);
		if(newActiveFilters[key].length <= 0) delete newActiveFilters[key];
		onFilterChange(newActiveFilters);
	};

	const onClickClear = () => {
		onFilterChange({});
	};

	return (
		Object.keys(activeFilters).length ?
			<div className="w-full h-16 absolute left-0 -top-16 z-20 bg-white border-b p-4 overflow-x-scroll whitespace-nowrap">
				{Object.keys(activeFilters).map(key => (
					<span key={key}>
						<span className="mr-2">
							{key}:
						</span>
						{activeFilters[key].map((val, i) => (
							<button
								key={i}
								value={`${key}:${val}`}
								className="text-slate-600 bg-slate-200 rounded-full px-3 py-1 mr-2"
								onClick={onClickApplied}>
								{val} &times;
							</button>
						))}
					</span>
				))}
				<button
					className="px-4 py-1"
					onClick={onClickClear}>
					Clear all
				</button>
			</div>
		: null
	)
}