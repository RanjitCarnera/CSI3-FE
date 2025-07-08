import { Button } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { DefaultCalendarComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { selectStaffViewFilters, setStaffViewFilters } from "@redux/StaffViewSlice";
import {
	ButtonWrapper,
	FormWrapper,
	Wrapper,
} from "@screens/staff-view/parts/from-to-filters/from-to-filters.styles";

export const FromToFilters = () => {
	const filters = useSelector(selectStaffViewFilters);
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
					console.log("testContext.parent.startDate", testContext.parent);
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
			dispatch(setStaffViewFilters({ ...filters, startDate: undefined, endDate: undefined }));
		} else {
			dispatch(
				setStaffViewFilters({
					...filters,
					startDate: startDateString,
					endDate: endDateString,
				}),
			);
		}
	}, [formik.values]);

	const handleOnClick = () => {
		void (async function a() {
			await formik.setFieldValue("startDate", "");
			await formik.setFieldValue("endDate", "");
			formik.setErrors({ startDate: undefined, endDate: undefined });
		})();
	};

	return (
		<Wrapper>
			<FormWrapper>
				<ValidatedField
					placeholder={"Utilization Start Date"}
					name={"startDate"}
					formikConfig={formik}
					component={DefaultCalendarComponent}
				/>

				<ValidatedField
					placeholder={"Utilization End Date"}
					name={"endDate"}
					formikConfig={formik}
					component={DefaultCalendarComponent}
				/>
			</FormWrapper>

			<ButtonWrapper>
				<Button content={{ label: "Reset Utilization Window" }} onClick={handleOnClick} />
			</ButtonWrapper>
		</Wrapper>
	);
};
