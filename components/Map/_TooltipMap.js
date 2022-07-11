import { useEffect, useState, useRef } from "react";
import { getText, getDate, getTitle } from "./../../helpers";
import { Tooltip } from "../Utils";

export default function TooltipMap({
	feature = {},
	transform,
	parentWidth,
}) {
	const [style, setStyle] = useState({});

	useEffect(() => {
		const { coords, offset } = feature;
		let [x, y] = coords;
		let [offsetX, offsetY] = offset;
		x = x * transform.k + transform.x + offsetX;
		y = y * transform.k + transform.y + offsetY;
		setStyle({ position: "absolute", left: x, top: y });
	}, [feature, transform]);

	return(
		<div
			className="absolute pointer-events-none transition-all"
			style={style}>
			<Tooltip
				open={true}
				parentWidth={parentWidth}>
				<div>
					{feature.type === "state" ?
						<div className="p-4">
							<div className="text-lg font-bold text-gray-blue-200">
								{getText(feature.state)}
							</div>
							
							{["Enacted"].map((progress, i) => (
								feature.tallies[progress] && Object.keys(feature.tallies[progress]).length ?
									<div className="pt-2 text-gray-blue-400" key={i}>
										<strong>{getText(progress)}: </strong>
										{Object.keys(feature.tallies[progress]).map((key, i) => (
											<span key={key}>
												{feature.tallies[progress][key]}
												&nbsp;
												{getText(key).toLowerCase()}{feature.tallies[progress][key] > 1 ? "s" : null}
												{i < Object.keys(feature.tallies[progress]).length - 1 ? ", " : ""}
											</span>
										))}
									</div>
								: null
							))}

						</div>
					: <div className="p-4">
							<div className="pb-2 text-lg font-bold capitalize text-gray-blue-200">
								{getTitle(feature)}
							</div>
							<div className="text-gray-blue-400">
								{getDate(feature.date_intro)}
							</div>
						</div>
					}
					<div className="p-4 border-t border-gray-blue-400 text-xs text-gray-blue-400">
						{feature.hasOwnProperty("state") ?
							"Click to see all activity"
						: "Click to learn more about this activity"}
					</div>
				</div>
			</Tooltip>
		</div>
	);
}