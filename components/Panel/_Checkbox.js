import { Svg } from "../Utils";
import { TooltipInfo } from "../Utils";

export default function Checkbox({
	val,
	label,
	id,
	group,
	active,
	tooltip,
	parent,
	onChange,
}) {
	let symbolClassName;
	if(val === "LocalSch") symbolClassName = "w-4 h-4 mr-2 inline fill-local-1";
	if(val === "LocalOth") symbolClassName = "w-4 h-4 mr-2 inline fill-local-2";
	if(val === "State") symbolClassName = "w-4 h-4 mr-2 inline fill-state-3 stroke-map-outline";
	if(val === "Federal") symbolClassName = "w-4 h-4 mr-2 inline fill-map-outline";
	return(
		<div className="mb-2">
			<input
				type="checkbox"
				role="option"
				id={id}
				value={val}
				data-group={group}
				data-value={val}
				aria-checked={active}
				aria-selected={active}
				checked={active}
				tabIndex={0}
				onChange={onChange}
				className="pointer-events-none sr-only" />
			<label
				htmlFor={id}
				className="inline pr-6 cursor-pointer text-md">
				<span>
					<span>
						<span className="inline-flex">
							{active ?
								<span className="w-4 h-4 relative inline-flex bg-accent-blue rounded">
									<img
										src="/IconCheck.svg"
										alt=""
										width={10}
										height={10}
										className="w-2 h-2 absolute top-1 left-1" />
								</span>
							: <span className="w-4 h-4 inline-flex rounded border border-gray-400" />}
						</span>
					</span>
					<span className="inline pl-2">
						{group === "level" ?
							<Svg symbol={val} className={symbolClassName} />
						: null}
						<span className="type-label">
							{label}
						</span>
					</span>
				</span>
			</label>
			{tooltip ?
				<span className="-ml-6">
					<TooltipInfo parent={parent}>
						{tooltip}
					</TooltipInfo>
				</span>
			: null}
		</div>
	);
}