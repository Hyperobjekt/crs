import Button from "./_Button";

export default function ButtonExt({ url, children }) {
	return (
		url ?
			<a href={url}
				rel="noreferrer"
				target="_blank">
				<Button
					imgSrc="IconExternal.svg"
					onClick={null}>
					{children}
				</Button>
			</a>
		: ""
	);
};