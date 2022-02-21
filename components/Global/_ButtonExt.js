export default function ButtonExt({ url, children }) {
	return (
		url ?
			<a href={url}
				rel="noreferrer"
				target="_blank"
				className="w-full flex justify-items-center border border-black rounded-lg px-2 py-2 text-center">
				<div className="flex m-auto">
					{children}
					<img
						className="w-4 h-4 my-auto ml-2"
						src="IconExternal.svg"
						alt="" />
				</div>
			</a>
		: ""
	);
};