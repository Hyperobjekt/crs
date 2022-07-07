import * as d3 from "d3";

import VARS from "../../vars";
import { getText } from "./../../helpers";
import { Svg } from "../Utils";



// import activitySchema from "./../data/activity";

export default function Legend() {
	return (
		<div className="p-4 absolute hidden md:block bottom-4 right-4 bg-white shadow rounded-xl">
			<h3 className="text-md font-bold center pb-3 px-[5px]">
				Progress and level of anti-CRT activity
			</h3>
			<table cellPadding="5" className="text-sm">
				<thead className="font-bold">
					<tr>
						<td className="w-22">{getText("level")}</td>
						<td className="w-18 whitespace-nowrap">Not adopted</td>
						<td className="w-18">Adopted</td>
					</tr>
				</thead>
				<tbody>

					{["LocalSch", "LocalOth"].map((key, i) => {
						return(
							<tr key={i}>
								<td className="w-22">{getText(key)}</td>
								<td className="w-18 overflow-visible">
									<Svg
										symbol={key}
										className="w-4 h-4 m-auto"
										fill={`url(#pattern-${key})`}
										stroke={VARS.LOCAL_COLORS[key][1]} />
								</td>
								<td className="w-18 overflow-visible">
									<Svg
										symbol={key}
										className="w-4 h-4 m-auto"
										fill={VARS.LOCAL_COLORS[key][0]}
										stroke={VARS.LOCAL_COLORS[key][1]} />
								</td>
							</tr>
						)
					})}

					<tr>
						<td className="w-22">State and federal</td>
						<td className="w-18">
							<Svg
								symbol="State"
								className="w-4 h-4 m-auto stroke-map-outline"
								fill={VARS.STATE_COLORS[1]}
								stroke={VARS.STROKE_COLOR_DEFAULT} />
						</td>
						<td className="w-18">
							<Svg
								symbol="State"
								className="w-4 h-4 m-auto stroke-map-outline"
								fill={VARS.STATE_COLORS[2]}
								stroke={VARS.STROKE_COLOR_DEFAULT} />
						</td>
					</tr>

				</tbody>
			</table>

			<ul>
				
			</ul>
		</div>
	);
}