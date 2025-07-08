import { type FormikProps } from "formik/dist/types";
import { Message } from "primereact/message";
import { TabPanel } from "primereact/tabview";
import React, { Suspense, useRef } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import {
	CREATE_USER_IN_ACCOUNT_ADD_MUTATION,
	CREATE_USER_IN_ACCOUNT_MODAL_MUTATION,
} from "@components/relay/create-user-in-account-modal/create-user-in-account-modal.graphql";
import { type CreateUserInAccountModalProps } from "@components/relay/create-user-in-account-modal/create-user-in-account-modal.interface";
import { SelectUserInAccountGroupsOfAccountAdminField } from "@components/relay/select-user-in-account-groups-of-account-admin-field";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import { type createUserInAccountModal_AddMutation } from "@relay/createUserInAccountModal_AddMutation.graphql";
import { type createUserInAccountModal_CreateMutation } from "@relay/createUserInAccountModal_CreateMutation.graphql";
import { RegistrationForm, type RegistrationFormState } from "../../ui/registration-form";
import { TkButtonLink } from "../../ui/TkButtonLink";
import { TkDialog } from "../../ui/TkDialog";
import { TkTabView } from "../../ui/TkTabView";
import { ValidatedField } from "../../ui/ValidatedField";
import { SelectUserForm, type SelectUserFormState } from "../SelectUserForm";

export const CreateUserInAccountModal = ({
	connectionId,
	accountId,
	onCompleted,
	isVisible,
	onHide,
}: CreateUserInAccountModalProps) => {
	const [create] = useMutation<createUserInAccountModal_CreateMutation>(
		CREATE_USER_IN_ACCOUNT_MODAL_MUTATION,
	);
	const [add] = useMutation<createUserInAccountModal_AddMutation>(
		CREATE_USER_IN_ACCOUNT_ADD_MUTATION,
	);
	const currentUser = useSelector(selectCurrentUser);

	const registrationFormik = useRef<FormikProps<RegistrationFormState | SelectUserFormState>>();

	return (
		<Suspense fallback={"Loading..."}>
			<TkDialog
				dismissableMask={true}
				header={<h1>Change user's groups</h1>}
				visible={isVisible}
				onHide={() => {
					onHide();
				}}
				footer={
					<div className="flex">
						<TkButtonLink
							disabled={registrationFormik?.current?.isSubmitting}
							type="button"
							onClick={() => {
								onHide();
							}}
							label={"Cancel"}
							className="m-auto w-auto"
						/>
						<TkButtonLink
							disabled={registrationFormik?.current?.isSubmitting}
							onClick={() => registrationFormik?.current?.handleSubmit()}
							label={"Create (or add) user"}
							className="m-auto w-auto"
						/>
					</div>
				}
			>
				<TkTabView>
					<TabPanel header={"New user"}>
						<Message
							className="mb-2"
							severity={"info"}
							content={
								"If the user exists already (by email), they are added to the account."
							}
						/>
						<RegistrationForm
							hideAccountName={true}
							ref={registrationFormik as any}
							buttonLabel={"Create user"}
							onSuccess={(data, onSuccess) => {
								create({
									variables: {
										input: {
											accountId,
											name: data.name,
											email: data.email,
											password: data.password,
											groupId: (data as any)[0],
										},
										connections: connectionId ? [connectionId] : [],
									},
									onCompleted: () => {
										onSuccess && onSuccess();
										onCompleted && onCompleted();
										registrationFormik.current?.resetForm({});
									},
								});
							}}
							additionalFields={(formik) => {
								return (
									<ValidatedField<
										RegistrationFormState & {
											groupId: string;
										},
										string[]
									>
										className="mb-4"
										name={"groupId"}
										label={"Select group to add"}
										placeholder={"Default: User"}
										formikConfig={formik as any}
										component={(config) => (
											<Suspense fallback={"Loading..."}>
												<SelectUserInAccountGroupsOfAccountAdminField
													accountId={accountId}
													config={config}
												/>{" "}
											</Suspense>
										)}
									/>
								);
							}}
						/>
					</TabPanel>
					<TabPanel header="Existing user">
						<Message
							className="mb-2"
							severity={"info"}
							content={
								"If the user is already in the account, nothing will change - not even the user's groups."
							}
						/>
						<SelectUserForm
							accountId={accountId}
							ref={registrationFormik as any}
							onSuccess={(data, onSuccess) => {
								add({
									variables: {
										input: {
											accountId,
											userId: data.userId!,
											groupIds: data.groupIds ?? [],
										},
										connections: connectionId ? [connectionId] : [],
									},
									onCompleted: (a) => {
										onSuccess && onSuccess();
										onCompleted && onCompleted();
										registrationFormik.current?.resetForm({});

										if (
											a.Admin.Management.addUserToAccountAdmin?.edge.node.user
												.id === currentUser?.user.id
										) {
											window.location.reload();
										}
									},
								});
							}}
						/>
					</TabPanel>
				</TkTabView>
			</TkDialog>
		</Suspense>
	);
};
