import { useState, useEffect } from "react";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";

import DateTextField from "./_DateTextField";

import Button from "../Global/_Button";

const DATE_FORMAT = "YYYY-MM-DD";
const UTC_TZ = "T00:00:00.000-07:00";

// const TODAY = new Date();
// const JAN_2020 = new Date("2020-01-01");
// const PAST_30 = new Date(new Date().setDate(TODAY.getDate() - 30));

const PRESET_1_START = new Date("2020-09-01"+UTC_TZ);
const PRESET_1_END = new Date("2020-12-31"+UTC_TZ);

const PRESET_2_START = new Date("2021-01-01"+UTC_TZ);
const PRESET_2_END = new Date("2021-03-31"+UTC_TZ);

const PRESET_3_START = new Date("2021-04-01"+UTC_TZ);
const PRESET_3_END = new Date("2021-07-31"+UTC_TZ);

const PRESET_4_START = new Date("2021-08-01"+UTC_TZ);
const PRESET_4_END = new Date("2021-10-31"+UTC_TZ);

const getDateStr = (date) => {
	const dd = date.getDate();
	const mm = date.getMonth()+1; 
	const yyyy = date.getFullYear();
	const newStr = `${yyyy}-${mm}-${dd}`;
	return newStr;
}

export default function DateSelector({ start, end, onChange }) {
	const [openSelector, setToggledOpen] = useState(null);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeButton, setActiveButton] = useState(null);
	

	useEffect(() => {
		setStartDate(start ? new Date(start) : null);
		setEndDate(end ? new Date(end) : null);
		if(new Date(start).toJSON() !== new Date(startDate).toJSON()
			|| new Date(end).toJSON() !== new Date(endDate).toJSON()) {
			setActiveButton(null);	
		}
	}, [start, end]);

	useEffect(() => {
		const newStartDate = startDate ? new Date(startDate).toJSON() : null;
		const newEndDate = endDate ? new Date(endDate).toJSON() : null;
		onChange(newStartDate || newEndDate ? [newStartDate, newEndDate] : null);
	}, [startDate, endDate]);

	const onStartDateChange = (newDate) => {
		setStartDate(newDate);
	}

	const onEndDateChange = (newDate) => {
		setEndDate(newDate);
	}

	const onClickPreset = (e) => {
		const dateRange = e.target.value ? e.target.value.split(",") : [null,null];
		const newStartDate = dateRange[0] ? new Date(dateRange[0]) : null;
		const newEndDate = dateRange[1] ? new Date(dateRange[1]) : null;
		setStartDate(newStartDate);
		setEndDate(newEndDate);
		setActiveButton(e.target.name);
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

	// const buttons = [
	// 	{
	// 		className: "button-left",
	// 		label: "All Time",
	// 		name: "all-time",
	// 		value: [null, getDateStr(TODAY)]
	// 	},
	// 	{
	// 		className: "button-center",
	// 		label: "Since 2020",
	// 		name: "2020",
	// 		value: [getDateStr(JAN_2020),getDateStr(TODAY)]
	// 	},
	// 	{
	// 		className: "button-right",
	// 		label: "Last 30 Days",
	// 		name: "30",
	// 		value: [getDateStr(PAST_30),getDateStr(TODAY)]
	// 	}
	// ];

	const buttons = [
		{
			className: "w-1/2 rounded-none rounded-tl-md -mb-[1px]",
			label: "Sept 2020 - Jan 2021",
			name: "1",
			value: [getDateStr(PRESET_1_START), getDateStr(PRESET_1_END)]
		},
		{
			className: "w-1/2 rounded-none rounded-tr-md -mb-[1px] -ml-[1px]",
			label: "Jan 2021 - Apr 2021",
			name: "2",
			value: [getDateStr(PRESET_2_START),getDateStr(PRESET_2_END)]
		},
		{
			className: "w-1/2 rounded-none rounded-bl-md",
			label: "Apr 2021 - Aug 2021",
			name: "3",
			value: [getDateStr(PRESET_3_START),getDateStr(PRESET_3_END)]
		},
		{
			className: "w-1/2 rounded-none rounded-br-md -ml-[1px]",
			label: "Aug 2021 - Nov 2021",
			name: "4",
			value: [getDateStr(PRESET_4_START),getDateStr(PRESET_4_END)]
		}
	];

	return(
		<>
			<div className="flex flex-wrap mb-4">
				{buttons.map(b => (
					<Button
						key={b.name}
						className={`${b.className} ${b.name === activeButton ? "button-active" : ""}`}
						name={b.name}
						value={b.value}
						onClick={onClickPreset}>
						{b.label}
					</Button>
				))}
			</div>
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