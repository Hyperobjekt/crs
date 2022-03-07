import React, { useEffect, useState, useRef } from "react";

import CloseBttn from "./../Icon/_CloseBttn";

export default function Panel({ children, zIndex, onClosePanel }) {

	const [active, setActive] = useState(true);

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
			<div style={{ zIndex }}
				className="w-96 h-full absolute left-0 top-8 pb-8 bg-white border-r shadow rounded-tr-xl">
				<div className="w-full h-full flex flex-col">
					{PanelContent}
				</div>
				<div className="w-full h-16 absolute left-0 bottom-0 bg-gradient-to-t from-white pointer-events-none"></div>
			</div>
		: null
	);
}