import BodyCell from "./_BodyCell";

export default function BodyRow({ rowData, colSchemas, index }) {
	let className;
	if(index % 2) {
		className = "flex items-center px-4 py-6 space-x-2 border-b bg-gray-100";
	} else {
		className = "flex items-center px-4 py-6 space-x-2 border-b bg-white";
	}
	return(
		<tr
			role="row"
			className={className}>
			{colSchemas.map(colSchema => (
				<BodyCell
					key={colSchema.key}
					colVal={rowData[colSchema.key]}
					colSchema={colSchema} />
			))}
		</tr>
	)
};