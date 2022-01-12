export default function Legend({ levelSchema = {} }) {
	return (
		<div className="w-48 absolute bottom-4 right-4">
			<ul>
				{levelSchema.hasOwnProperty("options")
					? levelSchema.options.map((o, i) => (
						<li key={i} className="flex items-center">
							{/*<Image
								width="15"
								height="15"
								src={`${o.key}.svg`}
								alt=""
								className="inline mr-2" />*/}
							<span>{o.label}</span>
						</li>
					)) : null}
			</ul>
		</div>
	);
}