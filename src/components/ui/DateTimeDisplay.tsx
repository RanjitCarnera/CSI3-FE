import { type Moment } from "moment";
import moment from "moment-timezone";

interface OwnProps {
	value?: string | null;
	showTimezone?: boolean;
	short?: boolean;
}

export const convertToMomentDate = (value: String): Moment => {
	return moment(value?.replace("[UTC]", "")).tz(moment.tz.guess());
};

export const formatDateTime = (value: string) => {
	return moment(value?.replace("[UTC]", ""))
		.tz(moment.tz.guess())
		.format("MM/DD/YYYY HH:mm");
};

export const formatMonthYear = (value: string) => {
	return moment(value?.replace("[UTC]", ""))
		.tz(moment.tz.guess())
		.format("MM/YY");
};

export const formatDate = (value: string) => {
	return moment(value?.replace("[UTC]", ""))
		.tz(moment.tz.guess())
		.format("MM/DD/YYYY");
};

export const formatDateShort = (value: string) => {
	return moment(value?.replace("[UTC]", ""))
		.tz(moment.tz.guess())
		.format("MM/DD/YY");
};

export const DateTimeDisplay = ({ value, showTimezone }: OwnProps) => {
	if (!value) {
		return null;
	}

	const formattedDateTime = formatDateTime(value);

	if (!showTimezone) {
		return <span>{formattedDateTime}</span>;
	}

	return (
		<div>
			<div>{formattedDateTime}</div>
			{!showTimezone && <small>{moment.tz.guess()}</small>}
		</div>
	);
};

export const DateDisplay = ({ value, showTimezone, short }: OwnProps) => {
	if (!value) {
		return null;
	}

	const formattedDateTime = short ? formatDateShort(value) : formatDate(value);

	if (!showTimezone) {
		return <span>{formattedDateTime}</span>;
	}

	return (
		<div>
			<div>{formattedDateTime}</div>
			{!showTimezone && <small>{moment.tz.guess()}</small>}
		</div>
	);
};
