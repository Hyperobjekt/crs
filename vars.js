import tailwind from "./tailwind.config";

const { colors } = tailwind.theme.extend;

const MIN_ZOOM = .7;
const MAX_ZOOM = 4;
const STROKE_COLOR_DEFAULT = colors["map-outline"];
const STROKE_COLOR_ACTIVE = colors["gray-600"];
const STROKE_WIDTH_DEFAULT = 1;
const STROKE_WIDTH_ACTIVE = 2.25;
const MARKER_SIZE = 12;
const DC_SIZE = 30;
const DC_OFFSET_X = 110;
const DC_OFFSET_Y = -20;

const STATE_COLORS = [
	colors["state-1"],
	colors["state-2"],
	colors["state-3"],
];

const LOCAL_COLORS = {
	LocalSch: [
		colors["accent-orange"],
		colors["accent-orange-dark"],
	],
	LocalOth: [
		colors["accent-purple"],
		colors["accent-purple-dark"],
	],
};

const SHAPES = {
	LocalSch: `M ${MARKER_SIZE / 2 + STROKE_WIDTH_DEFAULT} ${STROKE_WIDTH_DEFAULT} L ${MARKER_SIZE + STROKE_WIDTH_DEFAULT} ${MARKER_SIZE} L ${STROKE_WIDTH_DEFAULT} ${MARKER_SIZE} Z`,
	LocalOth: `M ${STROKE_WIDTH_DEFAULT} ${MARKER_SIZE / 2 + STROKE_WIDTH_DEFAULT} A ${MARKER_SIZE / 2} ${MARKER_SIZE / 2} 0 ${STROKE_WIDTH_DEFAULT} 0 ${MARKER_SIZE + STROKE_WIDTH_DEFAULT} ${MARKER_SIZE / 2 + STROKE_WIDTH_DEFAULT} A ${MARKER_SIZE / 2} ${MARKER_SIZE / 2} 0 ${STROKE_WIDTH_DEFAULT} 0 ${STROKE_WIDTH_DEFAULT} ${MARKER_SIZE / 2 + STROKE_WIDTH_DEFAULT}`,
	State: `M ${STROKE_WIDTH_DEFAULT} ${STROKE_WIDTH_DEFAULT} L ${MARKER_SIZE} ${STROKE_WIDTH_DEFAULT} V ${MARKER_SIZE} H ${STROKE_WIDTH_DEFAULT} V ${STROKE_WIDTH_DEFAULT}`,
};

const patternRotations = {
	LocalSch: 135,
	LocalOth: 90,
};
const patternWidth = 1.5;
const patternSpace = 1.5;

const LOCAL_PATTERNS = (
	<defs>
		{["LocalSch", "LocalOth"].map(level => (
			<pattern
				key={level}
				id={`pattern-${level}`}
				patternUnits="userSpaceOnUse"
				width={patternSpace + patternWidth / 2}
				height={patternSpace + patternWidth / 2}
				patternTransform={`rotate(${patternRotations[level]})`}>
				<line
					x1="0"
					y="0"
					x2="0"
					y2={patternSpace + patternWidth / 2}
					stroke={LOCAL_COLORS[level][0]}
					strokeWidth={patternWidth} />
			</pattern>
		))}

	</defs>
);

export default {
	MIN_ZOOM,
	MAX_ZOOM,
	STROKE_COLOR_DEFAULT,
	STROKE_COLOR_ACTIVE,
	STROKE_WIDTH_DEFAULT,
	STROKE_WIDTH_ACTIVE,
	MARKER_SIZE,
	DC_SIZE,
	DC_OFFSET_X,
	DC_OFFSET_Y,
	STATE_COLORS,
	LOCAL_COLORS,
	LOCAL_PATTERNS,
	SHAPES,
};