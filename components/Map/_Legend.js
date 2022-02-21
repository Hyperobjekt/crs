import * as d3 from "d3";

import getText from "./../../helpers/getText";

export default function Legend({ localColors, stateColors, levelSchema = {},  }) {

	const svgSymbols = {
		LocalOth: <path d="M12 1L24 22H0L12 1Z" />,
		LocalSch: <ellipse cx="12" cy="12" rx="12" ry="12" />,
		State: <rect width="24" height="24" />,
	};

	const Svg = ( { className, children, ...attrs }) => {
		return(
			<svg xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				className={className}
				{ ...attrs }>
				{/*<path { ...attrs } />*/}
				{children}
			</svg>
		)
	};

	return (
		<div className="w-60 p-4 absolute bottom-4 right-4 text-xs bg-white rounded">

			<table cellPadding="5">
				<thead>
					<tr>
						<td></td>
						<td>Introduced</td>
						<td>Passed</td>
					</tr>
				</thead>
				<tbody>

					{levelSchema.hasOwnProperty("options")
						? levelSchema.options.map((o, i) => (
							<tr key={i}>
								<td>{getText(o)}</td>
								<td>

									<Svg className="w-4 h-4 m-auto" fill={localColors[o]}>
										{svgSymbols[o]}
									</Svg>

								</td>
								<td>
									<Svg className="w-4 h-4 m-auto" fill={localColors[o]}>
										{svgSymbols[o]}
									</Svg>
								</td>
							</tr>
					)) : null}

					<tr>
						<td>State-level activity</td>
						<td>
							<Svg className="w-4 h-4 m-auto" fill={stateColors[1]}>
								{svgSymbols["State"]}
							</Svg>
						</td>
						<td>
							<Svg className="w-4 h-4 m-auto" fill={stateColors[2]}>
								{svgSymbols["State"]}
							</Svg>
						</td>
					</tr>

				</tbody>
			</table>

			<ul>
				
			</ul>
		</div>
	);
}