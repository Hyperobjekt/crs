import { useState } from "react";
// import MomentUtils from "@date-io/moment";
// import {
// 	DatePicker,
// 	KeyboardDatePicker,
// 	MuiPickersUtilsProvider,
// } from "@material-ui/pickers";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";

import DateTextField from "./_DateTextField";

const DATE_FORMAT = "YYYY-MM-DD";

export default function DateSelector() {
	const [openSelector, setToggledOpen] = useState(null);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onStartDateChange = (newDate) => {
		console.log(newDate);
		// const newDateStr = newDate.format(DATE_FORMAT);
		setStartDate(new Date(newDate));
	}

	const onEndDateChange = (newDate) => {
		console.log(newDate);
		// const newDateStr = newDate.format(DATE_FORMAT);
		setEndDate(new Date(newDate));
	}

	const CalButton = ({ type }) => {
		let date;
		if(type === "start") date = startDate;
		if(type === "end") date = endDate;

		return(
			<button
				style={{ opacity: openSelector === type ? 1 : .5 }}
				className="w-1/2 flex border border-black rounded px-2 py-1"
				onClick={() => setToggledOpen(openSelector === type ? null : type)}>
				<span>{startDate}</span>
				<img src="IconCal.svg" className="w-4 h-4 inline my-auto ml-auto" />
			</button>
		);
	}

	const CalSelector = ({ type }) => {
		let date, oppDate, onChange;
		if(type === "start") {
			date = startDate;
			oppDate = endDate;
			onChange = onStartDateChange;
		}
		if(type === "end") {
			date = endDate;
			oppDate = startDate;
			onChange = onEndDateChange;
		}

		return(
			<div className="w-1/2">
				{/*<MuiPickersUtilsProvider utils={MomentUtils}>
					<KeyboardDatePicker
						format={DATE_FORMAT}
						value={date}
						maxDate={oppDate}
						variant="inline"
						disableFuture={true}
						disableToolbar={true}
						// keyboardIcon={() => <img src="IconCal.svg" className="w-4 h-4 inline my-auto ml-auto" />}
						onChange={onChange} />
				</MuiPickersUtilsProvider>*/}

				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						format={DATE_FORMAT}
						value={date}
						hiddenLabel={true}
						// maxDate={oppDate}
						disableFuture={true}
						disableToolbar={true}
						variant="inline"
						// label={type === "start" ? "From" : "To"}
						renderInput={(params) => (
							<DateTextField { ...params } />
						)}
						// keyboardIcon={() => <img src="IconCal.svg" className="w-4 h-4 inline my-auto ml-auto" />}
						onChange={onChange} />
				</LocalizationProvider>
			</div>
		)
	}

	return(
		<>
			<div className="flex space-x-2">
				{/*<CalButton type="start" />*/}
				{/*<CalButton type="end" />*/}
				<CalSelector type="start" />
				<CalSelector type="end" />
			</div>
		</>
	)
}