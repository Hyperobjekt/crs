import getText from "./getText"

export default function getTitle(data) {

	if(data["Level"] && ["State", "Federal"].includes(data["Level"]) && data["Bill #"]) {
		return data["Bill #"];
	}
	else {
		let bodyName = getText(data["Body Name"]);
		let activityType = getText(data["Activity Type"]);
		if(!activityType || activityType === "Other activity") {
			activityType = "Activity";
		}
		else if(activityType.includes("Letter") || activityType.includes("letter")) {
			activityType = "Letter";
		}
		return `${bodyName} ${activityType}`;
	}

}