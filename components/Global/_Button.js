export default function Button({ style, imgSrc, url, onClick, children }) {

	let className = "button w-full flex border-gray-300 hover:bg-gray-200";

	if(style === "blue") {
		className = "button w-full flex bg-gray-blue-200 border-0";
	}
	if(style === "active") {
		className = "button w-full flex bg-gray-blue-200 border-accent-blue text-dark-blue";
	}

	let TagName = url ? "a" : "button";

	return (
		<TagName
			href={url ? url : null}
			rel={url ? "noreferrer" : null}
			target={url ? "_blank" : null}
			className={className}
			onClick={onClick}>
			<div className="h-full flex m-auto">
				{/*<div className="w-4 h-full flex absolute left-0 top-0">*/}
				{imgSrc ?
					<div className="w-3.5 h-full flex mr-4">
						<img src={imgSrc} className="w-auto h-full m-auto" />
					</div>
				: null}
				<span className="auto">
					{children}
				</span>
			</div>
		</TagName>
	);
};