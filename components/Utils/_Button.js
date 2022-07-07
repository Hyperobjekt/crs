export default function Button({
	style,
	imgSrc,
	url,
	className,
	onClick,
	children,
	...props
}) {
	
	let classes = "button w-full flex";
	if(style === "blue") {
		classes = "button w-full flex bg-gray-blue-200 text-md border-0";
	}
	if(style === "active") {
		classes = "button w-full flex bg-gray-blue-200 text-md border-accent-blue text-dark-blue";
	}

	let spanClasses = "";
	if(imgSrc) {
		spanClasses = "ml-4";
	}

	let TagName = url ? "a" : "button";

	return (
		<TagName
			href={url ? url : null}
			rel={url ? "noreferrer" : null}
			target={url ? "_blank" : null}
			className={`${classes} ${className}`}
			onClick={onClick}
			{ ...props }>
			<div className="h-full flex m-auto pointer-events-none">
				{imgSrc ?
					<div className="w-3.5 h-full flex">
						<img src={imgSrc} className="w-auto h-full m-auto" />
					</div>
				: null}
				{children ?
					<span className={spanClasses}>
						{children}
					</span>
				: null}
			</div>
		</TagName>
	);
};