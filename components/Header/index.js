import { useEffect, useState, useRef } from "react";

export default function Header({ activeView, onViewClick, onFilterToggle }) {
	return (
		<header className="relative z-20 p-4 border-b grid grid-cols-2">
			<div>
				<strong>CRS</strong>
			</div>
			<div className="flex justify-end">
				<button
					onClick={() => onViewClick(activeView === "map" ? "table" : "map")}
					className="flex border border-black rounded px-2 py-1 ml-4">
					<img src={`Icon${activeView === "map" ? "Table" : "Map"}.svg`} className="inline mr-2" />
					<span>{activeView === "map" ? "Table" : "Map"}</span>
				</button>
			</div>
		</header>
	)
}