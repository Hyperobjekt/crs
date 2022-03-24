import getDate from "./getDate";
// import siteCopy from "../data/copy";

// const getStaticProps = async () => {
// 	return {
// 		props: {
// 			siteCopy: siteCopy,
// 		}
// 	}
// }

const siteCopy = {
  "State/US": "State",
  "Level": "Level of Government",
  "Federal": "Federal",
  "State": "State",
  "LocalSch": "Local school district",
  "LocalOth": "City or county government",
  "\"County Name if Local\"": "County",
  "Authority Type": "Activity Type",
  "Exec directive": "Executive directive",
  "Legislation": "Legislation",
  "Opinion Ltr": "Opinion letter",
  "Regulation": "Regulation",
  "Resolution": "Resolution",
  "Statement": "Statement",
  "Attorney General Letter": "Attorney general letter",
  "Policy Change": "Policy revision",
  "Other": "Other activity",
  "\"Date Intro\"": "Date Introduced",
  "Date Intro": "Date Introduced",
  "6/8/2021": "June 8, 2021",
  "Summary Status": "Progress Status",
  "Pending": "Introduced and pending",
  "Enacted": "Introduced and adopted",
  "Expired or Withdrawn": "Introduced and withdrawn/expired",
  "Rejected": "Introduced and failed",
  "TARGET INSTITUTION": "Target Institution",
  "K-12": "K-12",
  "Higher Ed": "Higher education",
  "Other Govt": "State or federal agencies",
  "Other Contractors": "Contractors",
  "Private Business/Non Profit": "Private business/non-profit",
  "CONDUCT REGULATED": "Conduct Regulated",
  "Classroom teaching": "Classroom teaching",
  "Curricular content": "Curricular content",
  "Revision of a general EDI/antiracism policy": "Revision to equity, diversity, inclusion, or antiracism policy",
  "Disclosure of teaching/curriculum": "Disclosure of teaching or curriculum",
  "Trainings": "Trainings",
  "Conduct Required":  "Conduct Required",
  "Disclosure of teaching/curriculum": "Curricular surveillance",
  "Forbidden Books": "Forbidden books",
  "CONTENT TRIGGER": "Content Trigger",
  "\"divisive concepts\"/\"controversial issues\"": "\"Divisive concepts\" or \"controversial issues\"",
  "US institns = \"inherently\" or \"fundamentally\" \"racist\"": "The U.S. is fundamentally racist or sexist",
  "Indiv. Respons. for systemic racism": "Any individual should feel discomfort, guilt, anguish, or any other form of psychological distress on account of his or her race or sex",
  "\"Indiv. “discomfort, guilt, anguish, or any other form of psychological distress on account of his or her race”\"": "Any individual should feel discomfort, guilt, anguish, or any other form of psychological distress on account of his or her race or sex",
  "Meritocracy/hard work = racist": "Meritocracy or traits such as a hard work ethic are racist or sexist or were created by a particular race to oppress another race",
  "1619 Project": "Invokes the 1619 Project",
  "\"Critical Race Theory\"": "Invokes Critical Race Theory",
  "Enforcement Mechanism": "Enforcement Mechanism",
  "Funding": "Funding",
  "Creates a private cause of action": "Private cause of action",
  "Parent Rights": "Parent rights",
  "Race/sex/other?": "Category",
  "Race or ethnicity only": "Race or ethnicity only",
  "Race or ethnicity & sex": "Race or ethnicity and sex",
  "Race or ethnicity, sex & more": "Race or ethnicity, sex, and more",
  "Bill #": "Bill Number",
  "BodyName": "Body Name",
  "Title/Summary": "Summary",
  "Status (link)": "Source for current progress",
  "Full text (link)": "Full text",
  "US": "Federal",
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

export default function getText(str) {
	return siteCopy[str] ? siteCopy[str] : str;
}