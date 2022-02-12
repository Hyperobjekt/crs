import { useEffect, useState, useRef } from "react";

export default function Header({ activeView, onViewClick, onFilterToggle }) {
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
					View Federal Activities
				</button>
			</div>
		</header>
	)
}