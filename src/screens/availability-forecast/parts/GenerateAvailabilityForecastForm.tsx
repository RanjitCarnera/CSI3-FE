import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-relay";
import * as Yup from "yup";
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
			}
		}
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
	const [generateForecast] =
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
					},
				},
				onCompleted: (response) => {
					dispatch(
						setAvailabilityForecast(
							response.Availabilityforecast.generateAvailabilityForecast
								?.availabilityForecast as any,
						),
					);
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
						disabled={formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						label={formik.isSubmitting ? "Generating..." : "Generate Forecast"}
					/>
				</Form>
			</div>
		</TkCard>
	);
};
