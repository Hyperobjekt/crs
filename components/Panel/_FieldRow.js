export default function FieldRow({ children, fieldTitle }) {
	return (
		<li
			className="mb-2">
			<div className="text-xs">{fieldTitle}</div>
			{children}
		</li>
	);
};