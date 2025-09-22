import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { readInlineData, useMutation } from "react-relay";
import { match } from "ts-pattern";
import * as Yup from "yup";
import { type GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$key } from "@relay/GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment.graphql";
import { type GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$key } from "@relay/GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment.graphql";
import { type GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$key } from "@relay/GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment.graphql";
import { type GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$key } from "@relay/GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment.graphql";
import { type GenerateAvailabilityForecastForm_GenerateAvailabilityForecastMutation } from "../../../__generated__/GenerateAvailabilityForecastForm_GenerateAvailabilityForecastMutation.graphql";
import {
	AvailabilityForecastReportParametersFormPart,
	type AvailabilityForecastReportParametersFormState,
} from "../../../components/ui/AvailabilityForecastReportParametersFormPart";
import { DefaultCalendarComponent } from "../../../components/ui/DefaultTextInput";
import { TkButton } from "../../../components/ui/TkButton";
import { TkCard } from "../../../components/ui/TkCard";
import { ValidatedField } from "../../../components/ui/ValidatedField";
import {
	type ForecastRowParameter,
	selectAvailabilityForecastParameters,
	setAvailabilityForecast,
	setAvailabilityForecastParameters,
} from "../../../redux/AvailabilityForecastSlice";

const GENERATE_AVAILABILITY_FORECAST_MUTATION = graphql`
	mutation GenerateAvailabilityForecastForm_GenerateAvailabilityForecastMutation(
		$input: GenerateAvailabilityForecastInput!
	) {
		Availabilityforecast {
			generateAvailabilityForecast(input: $input) {
				availabilityForecast {
					kind
					...GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment
					...GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment
					...GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment
					...GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment
				}
			}
		}
	}
`;

const YEAR_MONTH_AVAILABILITY_FORECAST_INLINE_FRAGMENT = graphql`
	fragment GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment on YearMonthAvailabilityForecast
	@inline {
		kind
		rows {
			columns {
				available
				difference
				needed
				availablePeople {
					id
					name
				}
				yearMonth
				projects
			}
			roles {
				name
			}
		}
		summary {
			yearMonth
			needed
			difference
			available
			projects
		}
		yearAndMonths
		countPossibleUtilizationNotPeople
	}
`;

const CALENDAR_WEEK_AVAILABILITY_FORECAST_INLINE_FRAGMENT = graphql`
	fragment GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment on CalendarWeekAvailabilityForecast
	@inline {
		kind
		rows {
			columns {
				available
				difference
				needed
				availablePeople {
					id
					name
				}
				calendarWeek
				projects
			}
			roles {
				name
			}
		}
		summary {
			calendarWeek
			needed
			difference
			available
			projects
		}
		calendarWeeks
		countPossibleUtilizationNotPeople
	}
`;

const DAY_AVAILABILITY_FORECAST_INLINE_FRAGMENT = graphql`
	fragment GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment on DayAvailabilityForecast
	@inline {
		kind
		rows {
			columns {
				available
				difference
				needed
				availablePeople {
					id
					name
				}
				date
				projects
			}
			roles {
				name
			}
		}
		summary {
			date
			needed
			difference
			available
			projects
		}
		dates
		countPossibleUtilizationNotPeople
	}
`;

const YEAR_QUARTER_AVAILABILITY_FORECAST_INLINE_FRAGMENT = graphql`
	fragment GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment on YearQuarterAvailabilityForecast
	@inline {
		kind
		rows {
			columns {
				available
				difference
				needed
				availablePeople {
					id
					name
				}
				yearQuarter
				projects
			}
			roles {
				name
			}
		}
		summary {
			yearQuarter
			needed
			difference
			available
			projects
		}
		yearQuarters
		countPossibleUtilizationNotPeople
	}
`;

interface FormState extends AvailabilityForecastReportParametersFormState {
	fromOpt?: string;
	toOpt?: string;
	filterByDivisionsOpt?: string[];
	rows: ForecastRowParameter[];

	countPossibleUtilizationNotPeople?: boolean;
	showProjects?: boolean;
}

interface OwnProps {
	className?: string;
	scenarioId: string;
}

export const GenerateAvailabilityForecastForm = ({ scenarioId, className }: OwnProps) => {
	const parameters = useSelector(selectAvailabilityForecastParameters);
	const dispatch = useDispatch();
	const [generateForecast, isInFlight] =
		useMutation<GenerateAvailabilityForecastForm_GenerateAvailabilityForecastMutation>(
			GENERATE_AVAILABILITY_FORECAST_MUTATION,
		);

	const formik = useFormik<FormState>({
		initialValues: {
			reportType: "AvailabilityForecast",
			rows: parameters?.rows || [],
			filterByProjectsOpt: parameters?.filterByProjectsOpt,
			countPossibleUtilizationNotPeople: parameters?.countPossibleUtilizationNotPeople,
			showProjects: parameters?.showProjects,
			fromOpt: parameters?.fromOpt,
			toOpt: parameters?.toOpt,
			filterByRegionsOpt: parameters?.filterByRegionsOpt,
			filterByStagesOpt: parameters?.filterByStagesOpt,
			filterByDivisionsOpt: parameters?.filterByDivisionsOpt,
			capInMonths: 12,

			kind: parameters?.kind ?? "YearMonthAvailabilityForecast",
		},
		validationSchema: Yup.object().shape({
			rows: Yup.array().test("rows", function (value) {
				if (!value || value.length === 0) {
					return this.createError({
						path: "rows",
						message: "You need to provide at least one row.",
					});
				}
				return true;
			}),
		}),
		enableReinitialize: true,
		onSubmit: (values, { setSubmitting }) => {
			const capDisabled = Boolean(values.fromOpt || values.toOpt);
			dispatch(setAvailabilityForecastParameters(values));
			generateForecast({
				variables: {
					input: {
						scenarioId,
						fromOpt: values.fromOpt,
						toOpt: values.toOpt,
						filterByDivisionsOpt: values.filterByDivisionsOpt,
						filterByRegionsOpt: values.filterByRegionsOpt,
						filterByStagesOpt: values.filterByStagesOpt,
						filterByProjectsOpt: values.filterByProjectsOpt,
						rows: values.rows!,
						countPossibleUtilizationNotPeople:
							values.countPossibleUtilizationNotPeople || false,
						showProjects: values.showProjects || false,
						capInMonths: capDisabled ? null : values.capInMonths ?? 12,

						kind: values.kind,
					},
				},
				onCompleted: (response) => {
					const forecast =
						response.Availabilityforecast.generateAvailabilityForecast
							?.availabilityForecast;
					if (!forecast) return;
					const inlineData = match(forecast.kind)
						.with("YearMonthAvailabilityForecast", () =>
							readInlineData<GenerateAvailabilityForecastForm_YearMonthAvailabilityForecastInlineFragment$key>(
								YEAR_MONTH_AVAILABILITY_FORECAST_INLINE_FRAGMENT,
								forecast,
							),
						)
						.with("CalendarWeekAvailabilityForecast", () =>
							readInlineData<GenerateAvailabilityForecastForm_CalendarWeekAvailabilityForecastInlineFragment$key>(
								CALENDAR_WEEK_AVAILABILITY_FORECAST_INLINE_FRAGMENT,
								forecast,
							),
						)
						.with("DayAvailabilityForecast", () =>
							readInlineData<GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment$key>(
								DAY_AVAILABILITY_FORECAST_INLINE_FRAGMENT,
								forecast,
							),
						)
						.with("YearQuarterAvailabilityForecast", () =>
							readInlineData<GenerateAvailabilityForecastForm_YearQuarterAvailabilityForecastInlineFragment$key>(
								YEAR_QUARTER_AVAILABILITY_FORECAST_INLINE_FRAGMENT,
								forecast,
							),
						)
						.exhaustive();

					dispatch(setAvailabilityForecast(inlineData));
					setSubmitting(false);
				},
			});
		},
	});

	return (
		<TkCard className={`card-flat ${className || ""}`}>
			<div className="flex flex-column">
				<Form onSubmit={formik.handleSubmit}>
					<ValidatedField<FormState, string>
						className="mb-4"
						name={"fromOpt"}
						label={"From"}
						placeholder={"Leave empty to use current date"}
						formikConfig={formik}
						component={DefaultCalendarComponent}
					/>
					<ValidatedField<FormState, string>
						className="mb-4"
						name={"toOpt"}
						label={"To date"}
						placeholder={"Leave empty to use furthest out assignment end date"}
						formikConfig={formik}
						component={DefaultCalendarComponent}
					/>

					<AvailabilityForecastReportParametersFormPart formik={formik} />

					<TkButton
						disabled={isInFlight || formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						label={
							isInFlight || formik.isSubmitting
								? "Generating..."
								: "Generate Forecast"
						}
					/>
				</Form>
			</div>
		</TkCard>
	);
};
