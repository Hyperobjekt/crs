import VARS from "../../vars";

export default function Svg({
	symbol,
	className,
	children,
	...attrs
}) {

	const svgSymbols = {
		// LocalSch: <path d="M 12 2 L 23 22 H 1 L 12 2 Z" strokeWidth={VARS.STROKE_WIDTH_DEFAULT} />,
		// LocalOth: <ellipse cx="12" cy="12" rx="11" ry="11" strokeWidth={VARS.STROKE_WIDTH_DEFAULT} />,
		LocalSch: <path d={VARS.SHAPES["LocalSch"]} strokeWidth={VARS.STROKE_WIDTH_DEFAULT} />,
		LocalOth: <path d={VARS.SHAPES["LocalOth"]} strokeWidth={VARS.STROKE_WIDTH_DEFAULT} />,
		State: <path d={VARS.SHAPES["State"]} strokeWidth={VARS.STROKE_WIDTH_DEFAULT} />,
		Federal: <path d={VARS.SHAPES["Federal"]} fillRule="evenodd" clipRule="evenodd" />,
	};

	const viewBoxSize = VARS.MARKER_SIZE + VARS.STROKE_WIDTH_DEFAULT * 2;

	return (
		<svg xmlns="http://www.w3.org/2000/svg"
			viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
			width={viewBoxSize}
			height={viewBoxSize}
			className={className}
			{ ...attrs }>
			{svgSymbols[symbol]}
			{VARS.LOCAL_PATTERNS}
		</svg>
	);
};