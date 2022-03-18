import getText from "./getText"

export default function getTitle(data) {

	if(data["Level"] && ["State", "Federal"].includes(data["Level"]) && data["Bill #"]) {
		return data["Bill #"];
	}
	else {
		let bodyName = getText(data["Body Name"]);
		let activityType = getText(data["Activity Type"]);
		if(activityType === "Other activity") activityType = "Activity";
		return `${bodyName} ${activityType}`;
	}

}