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
			className="w-2/12">
			{content}
		</td>
	)
};