import { useState, useEffect } from "react";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import TextField from "@mui/material/TextField";

import DateTextField from "./_DateTextField";

import { Button } from "../Utils";

const DATE_FORMAT = "YYYY-MM-DD";
const UTC_TZ = "T00:00:00.000-06:00";

// const TODAY = new Date();
// const JAN_2020 = new Date("2020-01-01");
// const PAST_30 = new Date(new Date().setDate(TODAY.getDate() - 30));

const PRESET_1_START = `2020-09-01${UTC_TZ}`;
const PRESET_1_END = `2020-12-31${UTC_TZ}`;

const PRESET_2_START = `2021-01-01${UTC_TZ}`;
const PRESET_2_END = `2021-03-31${UTC_TZ}`;

const PRESET_3_START = `2021-04-01${UTC_TZ}`;
const PRESET_3_END = `2021-07-31${UTC_TZ}`;

const PRESET_4_START = `2021-08-01${UTC_TZ}`;
const PRESET_4_END = `2021-10-31${UTC_TZ}`;

const getDateStr = (date) => {
	const dateObj = new Date(date);
	const dd = ("0" + (dateObj.getDate())).slice(-2);
	const mm = ("0" + (dateObj.getMonth() + 1)).slice(-2); 
	const yyyy = dateObj.getFullYear();
	const newStr = `${yyyy}-${mm}-${dd}${UTC_TZ}`;
	return newStr;
}

export default function DateSelector({
	start,
	end,
	onChange,
}) {
	const [openSelector, setToggledOpen] = useState(null);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [activeButton, setActiveButton] = useState(null);
	

	useEffect(() => {
		setStartDate(start)
		setEndDate(end)
		if(new Date(start).toJSON() !== new Date(startDate).toJSON()
			|| new Date(end).toJSON() !== new Date(endDate).toJSON()) {
			setActiveButton(null);	
		}
	}, [start, end]);

	useEffect(() => {
		const newStartDate = startDate;
		const newEndDate = endDate;
		onChange(newStartDate || newEndDate ? [newStartDate, newEndDate] : null);
	}, [startDate, endDate]);

	const onStartDateChange = (newDate) => {
		setStartDate(newDate ? new Date(newDate).toJSON() : null);
		setActiveButton(null);
	}

	const onEndDateChange = (newDate) => {
		setEndDate(newDate ? new Date(newDate).toJSON() : null);
		setActiveButton(null);
	}

	const onClickPreset = (e) => {
		const dateRange = e.target.value ? e.target.value.split(",") : [null,null];
		let newStartDate = dateRange[0];
		let newEndDate = dateRange[1];
		setStartDate(newStartDate);
		setEndDate(newEndDate);
		setActiveButton(e.target.name);
	}

	const onClickReset = () => {
		setStartDate(null);
		setEndDate(null);
		setActiveButton(null);
	}

	const DateElem = ({ type }) => {
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
						value={date ? new Date(date) : null}
						hiddenLabel={true}
						maxDate={type === "start" && oppDate ? new Date(oppDate) : null}
						minDate={type === "end" && oppDate ? new Date(oppDate) : null}
						disableFuture={true}
						disableToolbar={true}
						clearable={true}
						reduceAnimations={true}
						variant="inline"
						renderInput={(params) => <TextField {...params} />}
						onChange={onChangeDate} />
				</LocalizationProvider>
			</div>
		)
	}

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
			value: [getDateStr(PRESET_2_START), getDateStr(PRESET_2_END)]
		},
		{
			className: "w-1/2 rounded-none rounded-bl-md",
			label: "Apr 2021 - Aug 2021",
			name: "3",
			value: [getDateStr(PRESET_3_START), getDateStr(PRESET_3_END)]
		},
		{
			className: "w-1/2 rounded-none rounded-br-md -ml-[1px]",
			label: "Aug 2021 - Nov 2021",
			name: "4",
			value: [getDateStr(PRESET_4_START), getDateStr(PRESET_4_END)]
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
						onClick={b.name === activeButton ? onClickReset : onClickPreset}>
						{b.label}
					</Button>
				))}
			</div>
			<div className="flex space-x-2 type-label">
				<DateElem type="start" />
				<div className="flex">
					<div className="my-auto">to</div>
				</div>
				<DateElem type="end" />
			</div>
		</>
	)
}