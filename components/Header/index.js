import { Button } from "./../Utils";

export default function Header({ activeView, activityCount, onViewClick, onMenuClick }) {
	return (
		<header className="h-20 relative z-[60] p-4 bg-white border-b flex gap-8">
			<div className="flex">
				<strong className="my-auto text-xxl">
					CRT Forward
				</strong>
			</div>
			<div className="w-[30em] my-auto table">
				{/*This map displays {activityCount} places in the USA where people are trying to implement laws against teaching Critical Race Theory*/}
			</div>
			<div className="flex justify-end content-center ml-auto">
				<div className="my-auto flex gap-4">
					<Button
						imgSrc={`Icon${activeView === "map" ? "Table" : "Map"}.svg`}
						onClick={() => onViewClick(activeView === "map" ? "table" : "map")}>
						{activeView === "map" ? "Table" : "Map"}
					</Button>

					<Button
						// imgSrc={`Icon${activeView === "map" ? "Table" : "Map"}.svg`}
						onClick={() => onMenuClick()}>
						Menu
					</Button>
				</div>
			</div>
		</header>
	)
}