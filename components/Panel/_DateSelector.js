import { useState, useEffect } from "react";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";

import DateTextField from "./_DateTextField";

const DATE_FORMAT = "YYYY-MM-DD";

export default function DateSelector({ start, end, onChange }) {
	const [openSelector, setToggledOpen] = useState(null);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		setStartDate(start ? new Date(start) : null);
		setEndDate(end ? new Date(end) : null);
	}, [start, end]);

	useEffect(() => {
		onChange([
			startDate ? new Date(startDate).toJSON() : null,
			endDate ? new Date(endDate).toJSON() : null
		]);
	}, [startDate, endDate]);

	const onStartDateChange = (newDate) => {
		setStartDate(newDate);
	}

	const onEndDateChange = (newDate) => {
		setEndDate(newDate);
	}


	const DateSelector = ({ type }) => {
		let date, oppDate, onChangeDate;

		if(type === "start") {
			date = startDate;
			oppDate = endDate;
			onChangeDate = onStartDateChange;
		}
		if(type === "end") {
			date = endDate;
			oppDate = startDate;
			onChangeDate = onEndDateChange;
		}

		return(
			<div className="w-1/2">
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						format={DATE_FORMAT}
						value={date}
						hiddenLabel={true}
						maxDate={type === "start" ? oppDate : null}
						minDate={type === "end" ? oppDate : null}
						disableFuture={true}
						disableToolbar={true}
						clearable={true}
						reduceAnimations={true}
						variant="inline"
						// label={type === "start" ? "From" : "To"}
						renderInput={(params) => <TextField {...params} />}
						onChange={onChangeDate} />
				</LocalizationProvider>
			</div>
		)
	}

	return(
		<>
			<div className="flex space-x-2 type-label">
				<DateSelector type="start" />
				<div className="flex">
					<div className="my-auto">to</div>
				</div>
				<DateSelector type="end" />
			</div>
		</>
	)
}