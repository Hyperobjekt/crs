import { getText, getDate } from "./../../helpers";

export default function BodyCell({ colVal, colSchema, children }) {
	let content;
	if(children) {
		content = children;
	} else if(colSchema.type === "date") {
		content = getDate(colVal);
	} else {
		content = getText(colVal);
	}
	return(
		<td
			role="cell"
			colSpan={colSchema.table.col}
			// className={`w-${colSchema.table.col}/12`}
			style={{
				width: `${colSchema.table.col/12 * 100}%`,
			}}>
			{content}
		</td>
	)
};