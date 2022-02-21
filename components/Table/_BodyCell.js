import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

import ButtonExt from "./../Global/_ButtonExt";

export default function BodyCell({ colVal, colSchema }) {
	return(
		<td
			role="cell"
			colSpan={colSchema.colSpan}
			className={colSchema.className}>
			{colSchema.button ?
				<ButtonExt url={colVal}>{getText(colSchema.key)}</ButtonExt>
			: colSchema.key ==="Date Intro" ? getDate(colVal) : getText(colVal) }
		</td>
	)
};