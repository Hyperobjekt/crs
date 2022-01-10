import React, { useEffect, useState, useRef } from "react";

import CloseBttn from "../Icon/_CloseBttn";

export default function Panel({ children, onClosePanel }) {

	const [active, setActive] = useState(true);

	const onCloseClick = () => {
		onClosePanel();
	};

	const PanelContent = children ? React.Children.map(children, (child) => {
  	if (React.isValidElement(child)) {
      return React.cloneElement(child, {
      	closeBttn: <CloseBttn className="ml-auto" callback={onCloseClick} />
      });
    }
    return child;
  }) : null;

	return (
		active ?
			<div
				id="panel"
				className="w-96 h-full absolute left-0 top-0 z-10 p-4 bg-white border-r">
				{PanelContent}
			</div>
		: null
	);
}