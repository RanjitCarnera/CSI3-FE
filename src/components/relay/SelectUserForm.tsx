import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { Suspense, useImperativeHandle } from "react";
import * as Yup from "yup";
import { SelectUserInAccountGroupsOfAccountAdminField } from "@components/relay/select-user-in-account-groups-of-account-admin-field";
import { SelectUserField } from "./SelectUserField";
import { ValidatedField } from "../ui/ValidatedField";

export interface SelectUserFormState {
	userId?: string;
	groupIds?: string[];
}

interface OwnProps {
	accountId: string;
	onSuccess: (formState: SelectUserFormState, onSuccess?: () => void) => void;
}

export const SelectUserForm = React.forwardRef<FormikProps<SelectUserFormState>, OwnProps>(
	({ onSuccess, accountId }: OwnProps, ref) => {
		const formik = useFormik<SelectUserFormState>({
			initialValues: {},
			enableReinitialize: true,
			validationSchema: Yup.object().shape({
				userId: Yup.string().required("You need to select a user"),
			}),
			onSubmit: (data, { setSubmitting }) => {
				onSuccess(data, () => {
					setSubmitting(false);
				});
			},
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<SelectUserFormState, string>
					className="mb-4"
					name={"userId"}
					label={"Select user to add"}
					required={true}
					formikConfig={formik}
					component={SelectUserField}
				/>
				<ValidatedField<SelectUserFormState, string[]>
					className="mb-4"
					name={"groupIds"}
					label={"Select group to add"}
					placeholder={"Default: User"}
					formikConfig={formik as any}
					component={(config) => (
						<Suspense fallback={"Loading..."}>
							<SelectUserInAccountGroupsOfAccountAdminField
								accountId={accountId}
								config={config}
							/>
						</Suspense>
					)}
				/>
			</Form>
		);
	},
);
