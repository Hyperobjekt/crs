import siteCopy from "../data/copy";

function getText(str) {
	return siteCopy[str] || str;
}

export default getText;