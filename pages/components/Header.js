import { useEffect, useState, useRef } from "react";

export default function Header({ activeView, onViewClick }) {
	// const views = ["map", "table"];

	// const viewToggleElem = (view) => {
	// 	return(
	// 		<span key={view}>
	// 			<input
	// 				type="radio"
	// 				name="view"
	// 				id={view}
	// 				value={view}
	// 				checked={view === activeView}
	// 				onChange={onViewChange}
	// 				className="m-0 cursor-pointer" />
	// 			<label
	// 				htmlFor={view}
	// 				className="p-1 cursor-pointer" >
	// 				{view.charAt(0).toUpperCase() + view.slice(1)}
	// 			</label>
	// 		</span>
	// 	);
	// };



	return (
		<header className="relative z-20 p-4 border-b grid grid-cols-2">
			<div>
				<strong>CRS</strong>
			</div>
			<div className="flex justify-end">
				<button
					value={activeView === "map" ? "table" : "map"}
					onClick={onViewClick}
					className="border border-black rounded px-2 py-1 ml-4">
					{activeView === "map" ? "Table" : "Map"}
				</button>

				<button
					value="table"
					onClick={onViewClick}
					className="bg-slate-200 rounded px-2 py-1 ml-4">
					View Federal Action
				</button>
			</div>
		</header>
	)
}