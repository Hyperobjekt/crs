// import { useEffect, useState, useRef } from "react";
import Svg from "../Global/_Svg";

export default function Checkbox({ val, label, id, group, active, onChange }) {
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
				checked={active}
				tabIndex={0}
				onChange={onChange}
				className="pointer-events-none sr-only" />
			<label
				htmlFor={id}
				className="table cursor-pointer text-md">
				<div className="flex">
					<div>
						<div className="w-4 h-4 flex overflow-hidden rounded">
							{active ?
								<div className="w-full h-full flex bg-accent-blue">
									<img
										src="/IconCheck.svg"
										alt=""
										width={10}
										height={10}
										className="w-2.5 h-2.5 m-auto" />
								</div>
							: <div className="w-full h-full rounded border border-gray-400" />}
						</div>
					</div>
					<div className="pl-2 -mt-0.5">
						{group === "Level" ?
							<Svg symbol={val} className={symbolClassName} />
						: null}
						<span className="type-label">
							{label}
						</span>
					</div>
				</div>
			</label>
		</div>
	);
}