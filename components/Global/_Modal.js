import { Button } from "../Utils";

export default function Modal({ modalOpen, activeView, setModalOpen, setActiveView }) {

	const onClick = (e) => {
		const view = e.target.value;
		setActiveView(view);
		setModalOpen(false);
	}

	return(
		<div
			className="w-full h-full flex absolute left-0 top-0 z-[60] transition-opacity duration-700 ease-in-out"
			style={modalOpen ? null : {
				opacity: 0,
				pointerEvents: "none"
			}}>

			<div
				className="w-full h-full flex absolute left-0 top-0 z-10 bg-dark-blue/50"
				onClick={() => setModalOpen(false)} />

			<div className="relative z-20 p-12 m-auto bg-white rounded-xl shadow">
				<div className="max-w-prose">
					<p>The CRT Forward Tracking Project (FTP) identifies, tracks, and analyzes local, state, and federal activity that attempts to restrict access to truthful information about Critical Race Theory (CRT), race, and systemic racism. To demonstrate the breadth of anti-CRT activity across the country, FTP provides a comprehensive database of anti-CRT activity across all levels of government and varying types of official action.</p>
				</div>

				<div className="flex gap-6 justify-center my-6 text-center">
					<Button
						className="w-auto button-active"
						imgSrc={`IconMap.svg`}
						value="map"
						onClick={onClick}>
						View data on the map
					</Button>
					<Button
						className="w-auto"
						imgSrc={`IconTable.svg`}
						value="table"
						onClick={onClick}>
						View data in the table
					</Button>
				</div>

				<div className="text-center">
					Read more <a href="https://crtforward.law.ucla.edu/about/" target="_blank" rel="noreferrer" className="underline">about the project</a> and our <a href="https://crtforward.law.ucla.edu/methodology/" target="_blank" rel="noreferrer" className="underline">methodology</a>.
				</div>

			</div>

		</div>
	);
}