import React, { useEffect, useState, useRef } from "react";

export default function Map() {
	const [winSizes, setWinSizes] = useState({});
	const svgRef = useRef(null);

	useEffect(() => {
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	function onResize() {
		const { innerWidth, innerHeight } = window;
		setWinSizes({
			width: innerWidth,
			height: innerHeight
		});
	}

	return (
		<svg ref={svgRef}
				 width={winSizes.width}
				 height={winSizes.height} />
	)
}