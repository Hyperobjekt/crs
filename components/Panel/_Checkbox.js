// import { useEffect, useState, useRef } from "react";
export default function Checkbox({ val, label, id, group, active, onChange }) {

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
				className="flex pl-2 cursor-pointer text-md">		
				<div className="w-4 h-4 my-auto mr-2 flex overflow-hidden rounded">
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
				<span className="type-label">
					{label}
				</span>
			</label>
		</div>
	);
}