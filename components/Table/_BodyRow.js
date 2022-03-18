import { getText, getTitle } from "./../../helpers";
import Button from "./../Global/_Button";
import BodyCell from "./_BodyCell";

export default function BodyRow({ rowData, colSchemas, index, setActiveActivity }) {

	let className;
	if(index % 2) {
		className = "flex px-4 py-6 space-x-2 border-b bg-gray-100";
	} else {
		className = "flex px-4 py-6 space-x-2 border-b bg-white";
	}

	const onClick = () => {
		setActiveActivity(rowData);
	}

	return(
		<tr
			role="row"
			className={className}>
			<BodyCell colSchema={colSchemas[0]}>
				{getTitle(rowData)}
			</BodyCell>
			{colSchemas.filter(c => !c.custom).map(colSchema => (
				<BodyCell
					key={colSchema.key}
					colVal={rowData[colSchema.key]}
					colSchema={colSchema} />
			))}
			<BodyCell colSchema={colSchemas[colSchemas.length - 1]}>
				<Button onClick={onClick}>
					Read more
				</Button>
			</BodyCell>
		</tr>
	)
};