import React, { useEffect, useState, useRef } from "react";

import CloseBttn from "./../Icon/_CloseBttn";

export default function Panel({ open, zIndex, children, onClosePanel }) {

	const [active, setActive] = useState(true);
	const [style, setStyle] = useState({});

	useEffect(() => {
		let newStyle = { zIndex };
		if(open) newStyle = { ...newStyle, transform: "none" }
		setStyle(newStyle);
	}, [open]);

	const onCloseClick = () => {
		onClosePanel();
	};

	const PanelContent = children ? React.Children.map(children, (child) => {
  	if (React.isValidElement(child)) {
      return React.cloneElement(child, {
      	closeBttn: <CloseBttn className="ml-auto mb-auto" callback={onCloseClick} />
      });
    }
    return child;
  }) : null;

	return (
		active ?
			<div
				style={style}
				className="w-96 h-full absolute top-0 bg-white shadow -translate-x-96 transition-transform duration-300 ease-in-out">
				<div className="w-full h-full flex flex-col relative">
					{PanelContent}
					<div className="w-full h-6 absolute left-0 bottom-0 bg-gradient-to-t from-white pointer-events-none"></div>
				</div>
			</div>
		: null
	);
}