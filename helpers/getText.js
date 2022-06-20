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
  "body": "Body Name",

  "level": "Level",
  "Federal": "Federal",
  "State": "State",
  "LocalSch": "Local school district",
  "LocalOth": "City or county government",

  "type": "Activity Type",
  "Exec directive": "Executive directive",
  "Legislation": "Legislation",
  "Regulation": "Regulation",
  "Resolution": "Resolution",
  "Statement": "Statement",
  "Attorney General Letter": "Attorney general letter",
  "Policy Change": "Policy revision",
  "Other": "Other activity",

  "statement_content": "Statement Content",
  "Denounces CRT": "Denounces CRT",
  "CRT Not Taught": "CRT not taught",
  
  "target": "Target Institution",
  "target_1": "K-12",
  "target_2": "Higher education",
  "target_3": "State or federal agencies",
  "target_4": "Contractors",
  "target_5": "Private business/non-profit",

  "prohibited": "Conduct Prohibited",
  "prohibited_1": "Classroom teaching",
  "prohibited_2": "Curricular content",
  "prohibited_3": "Antiracism, Equity, Diversity and Inclusion Policy",
  "prohibited_4": "Trainings",

  "required": "Conduct Required",
  "required_1": "Curricular surveillance",
  "required_2": "Student education opt-out",
  "required_3": "Forbidden books",

  "trigger": "Content Trigger",
  "trigger_1": "Invokes Critical Race Theory",
  "trigger_2": "Invokes the 1619 Project",
  "trigger_3": "The U.S. is fundamentally racist or sexist",
  "trigger_4": "An individual, by virtue of his or her race or sex, bears responsibility for actions committed in the past by other members of the same race or sex",
  "trigger_5": "Any individual should feel discomfort, guilt, anguish, or any other form of psychological distress on account of his or her race or sex",
  "trigger_6": "Meritocracy or traits such as a hard work ethic are racist or sexist or were created by a particular race to oppress another race",
  "trigger_7": "\"Divisive concepts\" or \"controvesial issues\"",

  "enforcement": "Enforcement Mechanism",
  "enforcement_1": "Funding withheld",
  "enforcement_2": "Private cause of action",


  "category": "Category",
  "Race or ethnicity only": "Race or ethnicity only",
  "Race or ethnicity & sex": "Race or ethnicity and sex",
  "Race or ethnicity, sex & more": "Race or ethnicity, sex, and more",

  "bill": "Bill",
  "related": "Related Bill(s)",
  "date_intro": "Date Introduced",
  "date_adopted": "Date Adopted",

  "progress": "Progress Status",
  "Pending": "Pending",
  "Enacted": "Adopted",
  "Expired or Withdrawn": "Withdrawn/expired",
  "Rejected": "Failed",

  "url_source": "Source for current progress status",
  "url_text": "Full text",
  
  "N/A": "Not specified",
  "Not Specified": "Not specified",

  "state": "State",
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