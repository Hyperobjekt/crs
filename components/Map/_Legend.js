import * as d3 from "d3";

import { getText } from "./../../helpers";
import Svg from "../Global/_Svg";
// import activitySchema from "./../data/activity";

export default function Legend({ localColors, stateColors  }) {
	return (
		<div className="p-4 absolute bottom-4 right-4 text-xs bg-white shadow rounded-xl">

			<table cellPadding="5">
				<thead>
					<tr>
						<td className="w-22"></td>
						<td className="w-18 whitespace-nowrap">Not passed</td>
						<td className="w-18">Passed</td>
					</tr>
				</thead>
				<tbody>

					{["LocalSch", "LocalOth"].map((key, i) => {
						let className;
						if(key === "LocalSch") className = "w-4 h-4 m-auto fill-local-1";
						if(key === "LocalOth") className = "w-4 h-4 m-auto fill-local-2";
						return(
							<tr key={i}>
								<td className="w-22">{getText(key)}</td>
								<td className="w-18">
									<Svg symbol={key} className={className} opacity={0.5} />
								</td>
								<td className="w-18">
									<Svg symbol={key} className={className} />
								</td>
							</tr>
						)
					})}

					<tr>
						<td className="w-22">State and federal</td>
						<td className="w-18">
							<Svg symbol={"State"} className="w-4 h-4 m-auto fill-state-2 stroke-map-outline" />
						</td>
						<td className="w-18">
							<Svg symbol={"State"} className="w-4 h-4 m-auto fill-state-3 stroke-map-outline" />
						</td>
					</tr>

				</tbody>
			</table>

			<ul>
				
			</ul>
		</div>
	);
}