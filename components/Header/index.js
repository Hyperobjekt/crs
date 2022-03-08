import Button from "./../Global/_Button";

export default function Header({ activeView, onViewClick, onFilterToggle }) {
	return (
		<header className="relative z-50 p-4 bg-white border-b flex gap-8">
			<div className="flex">
				<strong className="my-auto text-xl">
					CRS
				</strong>
			</div>
			<div className="w-[30em]">
				This map displays 325 places in the USA where people are trying to implement laws against teaching Critical Race Theory
			</div>
			<div className="flex justify-end content-center ml-auto">
				<div className="my-auto">
					<Button
						imgSrc={`Icon${activeView === "map" ? "Table" : "Map"}.svg`}
						onClick={() => onViewClick(activeView === "map" ? "table" : "map")}>
						{activeView === "map" ? "Table" : "Map"}
					</Button>
				</div>
			</div>
		</header>
	)
}