import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { DefaultCalendarComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import {
	FormWrapper,
	Wrapper,
} from "@screens/project-view/parts/from-to-filters/from-to-filters.styles";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";

interface Props {
	initialState: { startDate?: string; endDate?: string };
	onChange: (newValue: { startDate?: string; endDate?: string }) => void;
	needsBoth?: boolean;
	label: string;
}

export const FromToFilters = ({ initialState, onChange, needsBoth = true, label }: Props) => {
	const formik = useFormik<{ startDate?: string; endDate?: string }>({
		initialValues: initialState,
		validationSchema: Yup.object().shape({
			startDate: Yup.string().test("yourTestCondition2", function (value, testContext) {
				if (!needsBoth) return true;
				if (testContext.parent.endDate && !value) {
					return this.createError({ path: "startDate", message: "" });
				}

				return true;
			}),
			endDate: Yup.string().test("yourTestCondition", function (value, testContext) {
				if (!needsBoth) return true;
				if (testContext.parent.startDate && !value) {
					return this.createError({
						path: "endDate",
						message: "start date must be before end date",
					});
				}

				if (value) {
					const end = new Date(value);
					const startDateString = this.parent.startDate;

					if (startDateString) {
						const startDate = new Date(startDateString);

						if (startDate > end) {
							return this.createError({
								path: "endDate",
								message: "End date needs to be on or after start date.",
							});
						}
					}
					return true;
				}
				return true;
			}),
		}),
		onSubmit: () => {},
	});

	useEffect(() => {
		const startDateString = formik.values.startDate;
		const endDateString = formik.values.endDate;
		const startDate = startDateString ? new Date(startDateString) : new Date();
		const endDate = endDateString ? new Date(endDateString) : new Date();
		const bothAreSet = startDateString && endDateString;
		const isCorrect = endDate.getTime() >= startDate.getTime();
		if (!needsBoth) return;

		if (!isCorrect || !bothAreSet) {
			onChange({
				startDate: undefined,
				endDate: undefined,
			});
		} else {
			onChange({
				startDate: applyFilter(formik.values.startDate),
				endDate: applyFilter(formik.values.endDate),
			});
		}
	}, [formik.values]);

	return (
		<Wrapper>
			<FormWrapper>
				<ValidatedField<{ startDate?: string; endDate?: string }, string | undefined>
					label={`${label} start`}
					placeholder={`${label} start date`}
					name={"startDate"}
					formikConfig={formik}
					component={(renderConfig) => (
						<DefaultCalendarComponent
							{...renderConfig}
							updateField={(newStart) => {
								renderConfig.updateField(newStart);
								if (needsBoth) return;

								const endDate = formik.values.endDate;
								onChange({
									startDate: newStart,
									endDate,
								});
							}}
						/>
					)}
				/>

				<ValidatedField<{ startDate?: string; endDate?: string }, string>
					label={`${label} end`}
					placeholder={`${label} end date`}
					name={"endDate"}
					formikConfig={formik}
					component={(renderConfig) => (
						<DefaultCalendarComponent
							{...renderConfig}
							updateField={(newEnd) => {
								renderConfig.updateField(newEnd);
								if (needsBoth) return;
								const startDate = formik.values.startDate;
								onChange({
									startDate,
									endDate: newEnd,
								});
							}}
						/>
					)}
				/>
			</FormWrapper>
		</Wrapper>
	);
};
