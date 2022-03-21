import { getText, getDate } from "./../../helpers";

export default function BodyCell({ colVal, colSchema, children }) {

	// const onClick = () => {
	// 	if(colSchema.key !== "Title/Summary") return;
	// }

	return(
		<td
			role="cell"
			colSpan={colSchema.colSpan}
			className={colSchema.className}
			// onClick={onClick}
			>
			{children ? children : colSchema.key === "Date Intro" ? getDate(colVal) : colVal ? getText(colVal) : "N/A"}
		</td>
	)
};

{/*<Button
	style="full"
	url={colVal}
	imgSrc="IconExternal.svg">
	{getText(colSchema.key)}
</Button>*/}