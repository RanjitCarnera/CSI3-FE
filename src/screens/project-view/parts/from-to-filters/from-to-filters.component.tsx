import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { DefaultCalendarComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { selectScenarioPeopleFilters, setProjectViewPeopleFilters } from "@redux/ProjectViewSlice";
import {
	FormWrapper,
	Wrapper,
} from "@screens/project-view/parts/from-to-filters/from-to-filters.styles";

export const FromToFilters = () => {
	const filters = useSelector(selectScenarioPeopleFilters);
	const dispatch = useDispatch();
	const formik = useFormik<{ startDate?: string; endDate?: string }>({
		initialValues: {
			startDate: filters.startDate,
			endDate: filters.endDate,
		},
		validationSchema: Yup.object().shape({
			startDate: Yup.string().test("yourTestCondition2", function (value, testContext) {
				if (testContext.parent.endDate && !value) {
					return this.createError({ path: "startDate", message: "" });
				}

				return true;
			}),
			endDate: Yup.string().test("yourTestCondition", function (value, testContext) {
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
		if (!isCorrect || !bothAreSet) {
			dispatch(
				setProjectViewPeopleFilters({
					...filters,
					startDate: undefined,
					endDate: undefined,
				}),
			);
		} else {
			dispatch(
				setProjectViewPeopleFilters({
					...filters,
					startDate: startDateString,
					endDate: endDateString,
				}),
			);
		}
	}, [formik.values]);

	useEffect(() => {
		void formik.setFieldValue("startDate", filters.startDate ?? "");
		void formik.setFieldValue("endDate", filters.endDate ?? "");
	}, [filters.startDate, filters.endDate]);
	return (
		<Wrapper>
			<FormWrapper>
				<ValidatedField
					label={"Utilization Start"}
					placeholder={"Utilization Start Date"}
					name={"startDate"}
					formikConfig={formik}
					component={DefaultCalendarComponent}
				/>

				<ValidatedField
					label={"Utilization End"}
					placeholder={"Utilization End Date"}
					name={"endDate"}
					formikConfig={formik}
					component={DefaultCalendarComponent}
				/>
			</FormWrapper>
		</Wrapper>
	);
};
