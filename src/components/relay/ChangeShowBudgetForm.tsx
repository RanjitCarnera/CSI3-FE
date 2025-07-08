import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { useDispatch } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { updateExtension } from "@redux/CurrentUserSlice";
import { type ChangeShowBudgetForm_ChangeLogoMutation } from "@relay/ChangeShowBudgetForm_ChangeLogoMutation.graphql";
import { type ChangeShowBudgetForm_CurrentUser$key } from "@relay/ChangeShowBudgetForm_CurrentUser.graphql";
import { type BudgetDisplay } from "@relay/unitSystemForm_QueryFragment.graphql";
import { TkButton } from "../ui/TkButton";
import { ValidatedField } from "../ui/ValidatedField";

const QUERY_FRAGMENT = graphql`
	fragment ChangeShowBudgetForm_CurrentUser on Query {
		Viewer {
			Auth {
				currentUser {
					user {
						extension {
							... on HarkinsUserExtensionAndId {
								budgetDisplay
							}
						}
					}
				}
			}
		}
	}
`;

const MUTATION = graphql`
	mutation ChangeShowBudgetForm_ChangeLogoMutation($input: SetBudgetDisplayInput!) {
		Admin {
			Auth {
				setBudgetDisplay(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;

interface FormState {
	budgetDisplay?: BudgetDisplay;
}

interface OwnProps {
	queryFragmentRef: ChangeShowBudgetForm_CurrentUser$key;
}

const dropdownOptions: Array<{ label: string; value: BudgetDisplay }> = [
	{
		label: "None",
		value: "None",
	},
	{
		label: "Only show budgeted",
		value: "BudgetedOnly",
	},
	{
		label: "Only show utilized",
		value: "UtilizedOnly",
	},
	{ label: "Show budget and utilized", value: "BudgetedAndUtilized" },
];

export const ChangeShowBudgetForm = ({ queryFragmentRef }: OwnProps) => {
	const query = useFragment<ChangeShowBudgetForm_CurrentUser$key>(
		QUERY_FRAGMENT,
		queryFragmentRef,
	);
	const [commit, isInFlight] = useMutation<ChangeShowBudgetForm_ChangeLogoMutation>(MUTATION);
	const dispatch = useDispatch();
	const formik = useFormik<FormState>({
		initialValues: {
			budgetDisplay: query.Viewer.Auth.currentUser?.user.extension.budgetDisplay,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit: (data) => {
			commit({
				variables: {
					input: {
						budgetDisplaySetting: data.budgetDisplay ?? "None",
					},
				},
				onCompleted: () => {
					dispatch(updateExtension({ budgetDisplay: data.budgetDisplay ?? "None" }));
					formik.setSubmitting(false);
					window.location.reload();
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<FormState, BudgetDisplay>
				className="mb-4"
				name={"budgetDisplay"}
				label={"Show budget"}
				required={true}
				formikConfig={formik}
				component={(renderConfig) => (
					<Dropdown
						options={dropdownOptions}
						value={renderConfig.fieldValue}
						onChange={(e) => {
							renderConfig.updateField(e.value as BudgetDisplay);
						}}
					/>
				)}
			/>

			<TkButton
				disabled={isInFlight || formik.isSubmitting}
				type="submit"
				label={"Save"}
				className="p-mt-2"
			/>
		</Form>
	);
};
