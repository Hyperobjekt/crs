import getText from "./../../helpers/getText";
import getDate from "./../../helpers/getDate";

import Button from "./../Global/_Button";

export default function BodyCell({ colVal, colSchema }) {

	const onClick = () => {
		if(colSchema.key !== "Title/Summary") return;
		
	}

	return(
		<td
			role="cell"
			colSpan={colSchema.colSpan}
			className={colSchema.className}
			onClick={onClick}>
			{colSchema.button ?
				<Button
					style="full"
					url={colVal}
					imgSrc="IconExternal.svg">
					{getText(colSchema.key)}
				</Button>
			: colSchema.key === "Date Intro" ? getDate(colVal) : getText(colVal) }
		</td>
	)
};