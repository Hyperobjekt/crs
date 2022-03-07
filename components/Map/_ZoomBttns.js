export default function ZoomBttns({ onZoomClick }) {
	return(
		<div className="absolute top-1/2 -mt-7 right-4 flex flex-col border rounded shadow overflow-hidden text-center">
			<button
				className="w-7 h-7 text-center  bg-white border-b"
				onClick={onZoomClick}>
				+
			</button>

			<button
				className="w-7 h-7 text-center bg-white"
				onClick={onZoomClick}>
				-
			</button>
		</div>
	);
}