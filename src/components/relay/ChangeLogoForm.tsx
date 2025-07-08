import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { TaggedFileSelectionField } from "./FileSelectionField";
import { type ChangeLogoForm_ChangeLogoMutation } from "../../__generated__/ChangeLogoForm_ChangeLogoMutation.graphql";
import { type ChangeLogoForm_CurrentUser$key } from "../../__generated__/ChangeLogoForm_CurrentUser.graphql";
import { TkButton } from "../ui/TkButton";
import { ValidatedField } from "../ui/ValidatedField";

const FRAGMENT = graphql`
	fragment ChangeLogoForm_CurrentUser on Query {
		Viewer {
			Auth {
				currentAccount {
					extensions {
						kind
						... on AccountSettingsAccountExtension {
							kind
							logo {
								id
							}
						}
					}
				}
			}
		}
	}
`;

const CHANGE_EMAIL_MUTATION = graphql`
	mutation ChangeLogoForm_ChangeLogoMutation($input: SetAccountLogoInput!) {
		Admin {
			Auth {
				setAccountLogo(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;

interface FormState {
	logoRef?: string;
}

interface OwnProps {
	queryFragmentRef: ChangeLogoForm_CurrentUser$key;
}

export const ChangeLogoForm = ({ queryFragmentRef }: OwnProps) => {
	const query = useFragment<ChangeLogoForm_CurrentUser$key>(FRAGMENT, queryFragmentRef);

	const [changeLogo, isChanging] =
		useMutation<ChangeLogoForm_ChangeLogoMutation>(CHANGE_EMAIL_MUTATION);

	const logoId = query.Viewer.Auth.currentAccount?.extensions.find(
		(e) => e.kind === "AccountSettings",
	)?.logo?.id;
	const formik = useFormik<FormState>({
		initialValues: {
			logoRef: logoId,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit: (data) => {
			changeLogo({
				variables: {
					input: {
						logoRef: data.logoRef,
					},
				},
				onCompleted: () => {
					window.location.reload();
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<FormState, string>
				className="mb-4"
				name={"logoRef"}
				label={"File"}
				required={true}
				formikConfig={formik}
				component={TaggedFileSelectionField(["logo"], ".png,.jpg")}
			/>

			<TkButton
				disabled={isChanging || formik.isSubmitting}
				type="submit"
				label={formik.values.logoRef ? "Set logo" : "Reset logo to default"}
				className="p-mt-2"
			/>
		</Form>
	);
};
