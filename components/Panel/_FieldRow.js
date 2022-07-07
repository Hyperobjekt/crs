export default function FieldRow({
	children,
	fieldTitle,
}) {
	return (
		<li
			className="mb-2">
			<div className="text-sm">{fieldTitle}</div>
			{children}
		</li>
	);
};