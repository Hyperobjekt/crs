export default function ZoomBttns({ onZoomClick, setModalOpen }) {
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

			<button
				className="w-7 h-7 flex text-center bg-white rounded shadow"
				onClick={() => setModalOpen(true)}>
				<img
					src="/IconInfo.svg"
					alt=""
					width={10}
					height={10}
					className="m-auto" />
			</button>
		</div>
	);
}