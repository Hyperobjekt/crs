// import { useEffect, useState, useRef } from "react";

export default function Checkbox({ val, id, group, selected, onClick }) {
	return(
		<div>
			<input
				type="checkbox"
				role="option"
				id={id}
				value={val}
				data-group={group}
				data-value={val}
				aria-selected={selected}
				tabIndex={0}
				onClick={onClick}
				className="cursor-pointer" />
			<label
				htmlFor={id}
				className="pl-2 cursor-pointer">
				{val}
			</label>
		</div>
	);
}