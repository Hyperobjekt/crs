import BodyCell from "./_BodyCell";

export default function BodyRow({ rowData, colSchemas, index }) {
	let className;
	if(index % 2) {
		className = "flex px-4 space-x-2 border-b bg-slate-50";
	} else {
		className = "flex px-4 space-x-2 border-b bg-white";
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