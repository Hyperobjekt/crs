import { getText } from "./../../helpers";

export default function HeaderCell({ colSchema, currSort, onHeaderClick }) {
	return (
		<th
			scole="col"
			role="colheader"
			colSpan={colSchema.colSpan}
			className={colSchema.className}
			style={{
				cursor: colSchema.sortable ? "pointer" : "default"
			}}
			tabIndex={0}
			onClick={() => colSchema.sortable ? onHeaderClick(colSchema.key) : false}>
			<div className="flex py-5 text-left text-xs text-gray-500 font-normal">
				<div className="">
					{!colSchema.button ? getText(colSchema.key) : null}
				</div>
				{colSchema.sortable ?
					<div className="w-2 flex flex-col mb-auto ml-2">
						<div
							className="w-2 h-2"
							style={{ opacity: currSort.key === colSchema.key && currSort.dir === "desc" ? 1 : 0.5 }}>
							<img
								src="/IconArrowSort.svg"
								alt=""
								width={8}
								height={8} />
						</div>
						<div
							className="w-2 h-2"
							style={{ opacity: currSort.key === colSchema.key && currSort.dir === "asc" ? 1 : 0.5 }}>
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