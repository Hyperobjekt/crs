export default function Button({ style, imgSrc, url, onClick, children }) {

	let className = "button flex border-gray-300";
	if(style === "blue") {
		className = "button flex bg-gray-blue-200 border-accent-blue text-dark-blue";
	}
	if(style === "full") {
		className = "button flex border-gray-300 w-full text-center";
	}

	let TagName = url ? "a" : "button";

	return (
		<TagName
			href={url ? url : null}
			rel={url ? "noreferrer" : null}
			target={url ? "_blank" : null}
			className={className}
			onClick={onClick}>
			<div className="w-full h-full relative">
				<div className="w-4 h-full flex absolute left-0 top-0">
					<img src={imgSrc} className="w-auto h-full m-auto" />
				</div>
				<span className="auto ml-6">
					{children}
				</span>
			</div>
		</TagName>
	);
};