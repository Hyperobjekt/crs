import { getText } from "./../../helpers";

export default function HeaderCell({ colKey, colSchema, sort, onHeaderClick }) {
	return (
		<th
			scole="col"
			role="colheader"
			colSpan={colSchema.table.col}
			// className={`w-${colSchema.table.col}/12`}
			style={{
				width: `${colSchema.table.col/12 * 100}%`,
				cursor: colSchema.table.sortable ? "pointer" : "default"
			}}
			tabIndex={0}
			onClick={() => colSchema.table.sortable ? onHeaderClick(colKey, colSchema.type) : false}>
			<div className="flex py-5 text-left text-sm text-gray-500 font-normal">
				<div className="">
					{!colSchema.button ? getText(colKey) : null}
				</div>
				{colSchema.table.sortable ?
					<div className="w-2 flex flex-col mb-auto ml-2">
						<div
							className="w-2 h-2"
							style={{ opacity: sort.key === colKey && sort.order === "asc" ? 1 : 0.25 }}>
							<img
								src="/IconArrowSort.svg"
								alt=""
								width={8}
								height={8} />
						</div>
						<div
							className="w-2 h-2"
							style={{ opacity: sort.key === colKey && sort.order === "desc" ? 1 : 0.25 }}>
							<img
								src="/IconArrowSort.svg"
								alt=""
								width={8}
								height={8}
								className="rotate-180" />
						</div>
					</div>
				: null}
			</div>
		</th>
	);
};