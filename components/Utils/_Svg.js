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
		Federal: <path fillRule="evenodd" clipRule="evenodd" d="M11.1431 5.37273V2H12.8573V5.37273C16.1546 5.76118 18.7936 8.36057 18.8562 11.634L19.4996 11.7535V14.5399H24V22.8999H19.4996V22.9002H4.49961V22.8999H0V14.5399H4.49961V11.7535L5.1442 11.6337C5.20691 8.36045 7.84583 5.76117 11.1431 5.37273ZM6.87995 11.3113L11.9996 10.3602L17.1205 11.3115C16.8792 8.96094 14.7319 7.03683 12.0002 7.03683C9.26859 7.03683 7.12135 8.96081 6.87995 11.3113ZM11.9996 12.1038L17.7853 13.1786V14.5399H6.21389V13.1786L11.9996 12.1038ZM4.49961 21.1857H1.71429V16.2542H4.49961V21.1857ZM6.21389 21.1857V16.2542H7.50059V21.1857H6.21389ZM9.21487 21.1857V16.2542H14.9994V21.1857H9.21487ZM16.7137 21.1857H17.7853V16.2542H16.7137V21.1857ZM19.4996 21.1857H22.2857V16.2542H19.4996V21.1857Z" />,
	};

	const viewBoxSize = VARS.MARKER_SIZE + VARS.STROKE_WIDTH_DEFAULT * 2;

	return (
		<svg xmlns="http://www.w3.org/2000/svg"
			viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
			// width="12"
			// height="12"
			className={className}
			{ ...attrs }>
			{svgSymbols[symbol]}
			{VARS.LOCAL_PATTERNS}
		</svg>
	);
};