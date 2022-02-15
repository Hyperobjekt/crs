const DATE_FORMAT = "YYYY-MM-DD";

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default function getDate(str) {
  const date = new Date(str),
        year = date.getFullYear(),
        day = date.getDate(),
        month = MONTHS[date.getMonth()];

	return str ? `${month} ${day}, ${year}` : str;
}