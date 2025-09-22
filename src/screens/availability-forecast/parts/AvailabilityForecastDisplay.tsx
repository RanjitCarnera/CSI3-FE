import Color from "colorjs.io";
import moment from "moment-timezone";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { match } from "ts-pattern";
import { type GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment.graphql";
import { type GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment.graphql";
import type { GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment.graphql";
import { type GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$data } from "@relay/GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment.graphql";
import { TkCard } from "../../../components/ui/TkCard";
import { selectAvailabilityForecast } from "../../../redux/AvailabilityForecastSlice";

const getMonth = (ym: string) => ym.split("-")[1];
const getCalendarWeek = (cw: string) => cw.split("-")[1];
const getYear = (ym: string) => ym.split("-")[0];
const getQuarter = (yq: string) => yq.split("-")[1];
const ZERO_COLOR = new Color("#F0E199");
const GOOD_COLOR = new Color("#6CFF22");
const BAD_COLOR = new Color("#D64550");

const GOOD_RANGE = ZERO_COLOR.range(GOOD_COLOR, { space: "srgb", outputSpace: "srgb" });
const BAD_RANGE = ZERO_COLOR.range(BAD_COLOR, { space: "srgb", outputSpace: "srgb" });

export const AvailabilityForecastDisplay = () => {
	const availabilityForecast = useSelector(selectAvailabilityForecast);
	const showingProjects = availabilityForecast?.summary.every((fc) => fc.projects >= 0);

	return (
		<div className="w-12">
			{!availabilityForecast && (
				<div className="text-center mt-5">
					<h2>Please select your parameters on the left.</h2>
				</div>
			)}

			{availabilityForecast && (
				<TkCard className="overflow-auto w-12">
					<table style={{ borderSpacing: 0 }}>
						<thead>
							<tr>
								<th className="p-3 border-right-1 border-bottom-1">
									{match(availabilityForecast.kind)
										.with("YearMonthAvailabilityForecast", () => "Year")
										.with("CalendarWeekAvailabilityForecast", () => "Year")
										.with("DayAvailabilityForecast", () => "")
										.with("YearQuarterAvailabilityForecast", () => "Year")
										.exhaustive()}
								</th>
								{match(availabilityForecast.kind)
									.with("YearMonthAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$data;
										return casted?.yearAndMonths?.map((yearMonth) => {
											if (
												casted?.yearAndMonths.find(
													(ym) => getYear(ym) === getYear(yearMonth),
												) === yearMonth
											) {
												const colspan = casted.yearAndMonths.filter(
													(ym) => getYear(ym) === getYear(yearMonth),
												).length;
												return (
													<th
														className="p-3 text-center border-right-1 border-bottom-1"
														colSpan={colspan}
													>
														{getYear(yearMonth)}
													</th>
												);
											} else {
												return null;
											}
										});
									})
									.with("CalendarWeekAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$data;

										return casted?.calendarWeeks?.map((yearMonth) => {
											if (
												casted?.calendarWeeks.find(
													(ym) => getYear(ym) === getYear(yearMonth),
												) === yearMonth
											) {
												const colspan = casted.calendarWeeks.filter(
													(ym) => getYear(ym) === getYear(yearMonth),
												).length;
												return (
													<th
														className="p-3 text-center border-right-1 border-bottom-1"
														colSpan={colspan}
													>
														{getYear(yearMonth)}
													</th>
												);
											} else {
												return null;
											}
										});
									})
									.with("DayAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$data;

										return casted?.dates?.map((yearMonth) => {
											if (
												casted?.dates.find(
													(ym) => getYear(ym) === getYear(yearMonth),
												) === yearMonth
											) {
												const colspan = casted.dates.filter(
													(ym) => getYear(ym) === getYear(yearMonth),
												).length;
												return (
													<th
														className="p-3 text-center border-right-1 border-bottom-1"
														colSpan={colspan}
													>
														{getYear(yearMonth)}
													</th>
												);
											} else {
												return null;
											}
										});
									})
									.with("YearQuarterAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$data;

										return casted?.yearQuarters?.map((yearQuarter) => {
											if (
												casted?.yearQuarters.find(
													(yq) => getYear(yq) === getYear(yearQuarter),
												) === yearQuarter
											) {
												const colspan = casted.yearQuarters.filter(
													(yq) => getYear(yq) === getYear(yearQuarter),
												).length;
												return (
													<th
														className="p-3 text-center border-right-1 border-bottom-1"
														colSpan={colspan}
													>
														{getYear(yearQuarter)}
													</th>
												);
											} else {
												return null;
											}
										});
									})

									.exhaustive()}
							</tr>
							<tr>
								<th className="p-3 border-right-1 border-bottom-2">Position</th>
								{match(availabilityForecast.kind)
									.with("YearMonthAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$data;

										return casted.yearAndMonths?.map((ym) => (
											<th className="p-3 text-center border-right-1 border-bottom-2">
												{getMonth(ym)}
											</th>
										));
									})
									.with("CalendarWeekAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$data;

										return casted.calendarWeeks?.map((cw) => (
											<th className="p-3 text-center border-right-1 border-bottom-2">
												{getCalendarWeek(cw)}
											</th>
										));
									})
									.with("DayAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$data;

										return casted.dates?.map((cw) => (
											<th className="p-3 text-center border-right-1 border-bottom-2">
												{moment(cw.replace("[UTC]", ""))
													.tz(moment.tz.guess())
													.format("MM/DD")}
											</th>
										));
									})
									.with("YearQuarterAvailabilityForecast", () => {
										const casted =
											availabilityForecast as GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$data;

										return casted.yearQuarters?.map((ym) => (
											<th className="p-3 text-center border-right-1 border-bottom-2">
												{getQuarter(ym)}
											</th>
										));
									})
									.exhaustive()}
							</tr>
						</thead>

						<tbody>
							{availabilityForecast.rows?.map((row, rowIndex) => {
								return (
									<>
										<tr>
											<td className="p-3 border-right-2 border-bottom-1">
												{row.roles.map((r) => r.name).join(" & ")}
											</td>
											{match(availabilityForecast.kind)
												.with("YearMonthAvailabilityForecast", () => {
													const casted =
														availabilityForecast as GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$data;
													return casted.yearAndMonths?.map(() => (
														<th className="p-3 text-center border-right-1 border-bottom-1"></th>
													));
												})
												.with("CalendarWeekAvailabilityForecast", () => {
													const casted =
														availabilityForecast as GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$data;
													return casted.calendarWeeks?.map(() => (
														<th className="p-3 text-center border-right-1 border-bottom-1"></th>
													));
												})
												.with("DayAvailabilityForecast", () => {
													const casted =
														availabilityForecast as GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$data;
													return casted.dates?.map(() => (
														<th className="p-3 text-center border-right-1 border-bottom-1"></th>
													));
												})
												.with("YearQuarterAvailabilityForecast", () => {
													const casted =
														availabilityForecast as GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$data;
													return casted.yearQuarters?.map(() => (
														<th className="p-3 text-center border-right-1 border-bottom-1"></th>
													));
												})
												.exhaustive()}
										</tr>
										<tr>
											<td className="p-3 pl-4 border-right-2 border-bottom-1">
												Needed
											</td>
											{row.columns?.map((col) => {
												return (
													<td className="p-3 text-center border-right-1 border-bottom-1">
														{col.needed}
													</td>
												);
											})}
										</tr>
										<tr>
											<td className="p-3 pl-4 border-right-2 border-bottom-1">
												Available{" "}
												{availabilityForecast.countPossibleUtilizationNotPeople
													? "Slots"
													: "Resources"}
											</td>
											{row.columns?.map((col, columnIndex) => {
												const target =
													"availablePeople" +
													rowIndex +
													"-" +
													columnIndex;
												return (
													<td className="p-3 text-center border-right-1 border-bottom-1">
														<Tooltip
															target={"#" + target}
															content={col.availablePeople
																.map((p) => p.name)
																.join(", ")}
														/>
														<span id={target}>{col.available}</span>
													</td>
												);
											})}
										</tr>
										<tr>
											<td className="p-3 pl-4 border-right-2 border-bottom-2">
												Difference
											</td>
											{row.columns?.map((col) => {
												return (
													<td
														className="p-3 text-center border-right-1 border-bottom-2"
														style={{
															backgroundColor: differenceToColor(
																col.difference,
															),
														}}
													>
														{col.difference}
													</td>
												);
											})}
										</tr>
									</>
								);
							})}

							<tr>
								<td className="p-3 pl-4 font-bold border-right-2 border-bottom-1">
									Needed
								</td>
								{availabilityForecast.summary?.map((col) => {
									return (
										<td className="p-3 text-center border-right-1 border-bottom-1">
											{col.needed}
										</td>
									);
								})}
							</tr>
							<tr>
								<td className="p-3 pl-4 font-bold border-right-2 border-bottom-1">
									Available{" "}
									{availabilityForecast.countPossibleUtilizationNotPeople
										? "Slots"
										: "Resources"}
								</td>
								{availabilityForecast.summary?.map((col) => {
									return (
										<td className="p-3 text-center border-right-1 border-bottom-1">
											{col.available}
										</td>
									);
								})}
							</tr>
							<tr>
								<td
									className={classNames({
										"p-3 pl-4 font-bold border-right-2": true,
										"border-bottom-2": !showingProjects,
										"border-bottom-1": showingProjects,
									})}
								>
									Difference
								</td>
								{availabilityForecast.summary?.map((col) => {
									return (
										<td
											className={classNames({
												"p-3 text-center border-right-1": true,
												"border-bottom-2": !showingProjects,
												"border-bottom-1": showingProjects,
											})}
											style={{
												backgroundColor: differenceToColor(col.difference),
											}}
										>
											{col.difference}
										</td>
									);
								})}
							</tr>
							{availabilityForecast.summary.every((fc) => fc.projects >= 0) && (
								<tr>
									<td className="p-3 pl-4 font-bold border-right-2 border-bottom-2">
										Projects
									</td>
									{availabilityForecast.summary?.map((col) => {
										return (
											<td
												className="p-3 text-center border-right-1 border-bottom-2"
												style={{
													backgroundColor: differenceToColor(
														col.projects,
													),
												}}
											>
												{col.projects}
											</td>
										);
									})}
								</tr>
							)}
						</tbody>
					</table>
				</TkCard>
			)}
		</div>
	);
};

const differenceToColor = (difference: number): string => {
	const percentage = Math.max(0, Math.min(1, Math.abs(difference) / 50.0));
	if (difference < 0) {
		return BAD_RANGE(percentage).toString();
	} else {
		return GOOD_RANGE(percentage).toString();
	}
};
