// import { useEffect, useState, useRef } from "react";

export default function Checkbox({ val, id, group, active, onChange }) {
	return(
		<div>
			<input
				type="checkbox"
				role="option"
				id={id}
				value={val}
				data-group={group}
				data-value={val}
				aria-selected={active}
				checked={active}
				tabIndex={0}
				onChange={onChange}
				className="cursor-pointer" />
			<label
				htmlFor={id}
				className="pl-2 cursor-pointer">
				{val}
			</label>
		</div>
	);
}