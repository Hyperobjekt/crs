export default function ZoomBttns({
	onZoomClick,
}) {
	return(
		<div className="absolute top-1/2 -mt-7 right-4 flex flex-col text-center">
			<div className="flex flex-col mb-6 overflow-hidden border rounded shadow">
				<button
					className="w-7 h-7 text-center bg-white border-b"
					onClick={onZoomClick}>
					+
				</button>
				<button
					className="w-7 h-7 text-center bg-white"
					onClick={onZoomClick}>
					-
				</button>
			</div>
		</div>
	);
}