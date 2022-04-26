import getText from "./getText"

export default function getTitle(data) {

	if(data.level && ["State", "Federal"].includes(data.level) && data.bill) {
		return data.bill;
	}
	else {
		let bodyName = getText(data.body);
		let activityType = getText(data.type);
		if(!activityType || activityType === "Other activity") {
			activityType = "Activity";
		}
		else if(activityType.includes("Letter") || activityType.includes("letter")) {
			activityType = "Letter";
		}
		return `${bodyName} ${activityType}`;
	}

}