import getText from "./../../../helpers/getText";
import getDate from "./../../../helpers/getDate";

export default function fieldElem({ fieldKey, fieldVal }) {
	const fieldTitle = getText(fieldKey);
	return (
		<li
			key={fieldKey}
			className="mb-2">
			<div className="text-xs">{fieldTitle}</div>
			<div className="text-sm">
				{fieldKey === "Date Intro" ? getDate(fieldVal) : getText(fieldVal)}
			</div>
		</li>
	);
};