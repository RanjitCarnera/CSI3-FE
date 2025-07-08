import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { Suspense } from "react";
import { useMutation } from "react-relay";
import * as Yup from "yup";
import { SelectGroupField } from "./SelectGroupField";
import { type InviteUserToAccountModal_InviteMutation } from "../../__generated__/InviteUserToAccountModal_InviteMutation.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField } from "../ui/ValidatedField";

const CREATE_MUTATION = graphql`
	mutation InviteUserToAccountModal_InviteMutation(
		$input: InviteUserToAccountInput!
		$connections: [ID!]!
	) {
		Management {
			inviteUserToAccount(input: $input) {
				edge @appendEdge(connections: $connections) {
					cursor
					node {
						id
						email
						invitingUserName
					}
				}
			}
		}
	}
`;

interface OwnProps {
	onCompleted?: () => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	email?: string;
	groupId?: string;
}

export const InviteUserToAccountModal = ({
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const [invite] = useMutation<InviteUserToAccountModal_InviteMutation>(CREATE_MUTATION);

	const formik = useFormik<FormState>({
		initialValues: {
			email: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email("Please provide a valid email")
				.required("E-Mail is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			invite({
				variables: {
					input: {
						email: values.email!,
						groupId: values.groupId,
					},
					connections: connectionId ? [connectionId] : [],
				},
				onCompleted: () => {
					setSubmitting(false);
					onCompleted && onCompleted();
					resetForm({});
				},
				onError: (e) => {
					console.error(e);
				},
			});
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{"Invite user to account"}</h1>}
			visible={isVisible}
			onHide={() => {
				onHide();
			}}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => {
							onHide();
						}}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						label={"Invite"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"email"}
					label={"E-Mail"}
					required={true}
					formikConfig={formik}
					component={({ fieldValue, updateField, fieldName, isValid }) => {
						return (
							<InputText
								id={fieldName}
								name={fieldName}
								value={fieldValue}
								onChange={(e) => {
									updateField(e.target.value);
								}}
								className={classNames({ "p-invalid": !isValid })}
							/>
						);
					}}
				/>
				<Suspense fallback={"Loading..."}>
					<ValidatedField<FormState, string>
						className="mb-4"
						name={"groupId"}
						label={"Select group to add"}
						placeholder={"Default: User"}
						formikConfig={formik as any}
						component={SelectGroupField}
					/>
				</Suspense>
			</Form>
		</TkDialog>
	);
};
