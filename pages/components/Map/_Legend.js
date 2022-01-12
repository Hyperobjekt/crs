export default function Legend({ levelSchema }) {
	return (
		<div className="w-48 absolute bottom-4 right-4">
			<ul>
				{levelSchema.options.map((o, i) => (
					<li key={i} className="flex items-center">
						<img
							src={`${o.key}.svg`}
							width="15"
							height="15"
							className="inline mr-2" />
						<span>{o.label}</span>
					</li>
				))}
			</ul>
		</div>
	);
}