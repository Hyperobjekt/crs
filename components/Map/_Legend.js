import * as d3 from "d3";

import { getText } from "./../../helpers";
import { Svg } from "../Utils";
// import activitySchema from "./../data/activity";

export default function Legend({ localColors, stateColors  }) {
	return (
		<div className="p-4 absolute bottom-4 right-4 bg-white shadow rounded-xl">
			<h3 className="text-md font-bold center pb-3 px-[5px]">
				Progress and level of anti-CRT activity
			</h3>
			<table cellPadding="5" className="text-sm">
				<thead className="font-bold">
					<tr>
						<td className="w-22">{getText("Level")}</td>
						<td className="w-18 whitespace-nowrap">Not adopted</td>
						<td className="w-18">Adopted</td>
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