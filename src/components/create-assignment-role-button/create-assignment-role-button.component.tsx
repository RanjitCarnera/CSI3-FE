import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import { type FormikProps } from "formik/dist/types";
import React from "react";
import { useMutation } from "react-relay";
import { CREATE_ASSIGNMENT_ROLE_MUTATION } from "@components/create-assignment-role-button/create-assignment-role-button.graphql";
import { type CreateAssignmentRoleButtonProps } from "@components/create-assignment-role-button/create-assignment-role-button.types";
import { EditAssignmentRoleModal } from "@components/edit-assignment-role-button/parts/edit-assignment-role-form";
import { type EditAssignmentRoleFormState } from "@components/edit-assignment-role-button/parts/edit-assignment-role-form/edit-assignment-role-form.types";
import { type createAssignmentRoleButton_CreateAssignmentRoleMutation } from "@relay/createAssignmentRoleButton_CreateAssignmentRoleMutation.graphql";

export const CreateAssignmentRoleButton = ({ connectionId }: CreateAssignmentRoleButtonProps) => {
	const [create, isCreating] =
		useMutation<createAssignmentRoleButton_CreateAssignmentRoleMutation>(
			CREATE_ASSIGNMENT_ROLE_MUTATION,
		);

	const handleSubmit = (
		values: EditAssignmentRoleFormState,
		onHide: () => void,
		ref: React.MutableRefObject<FormikProps<EditAssignmentRoleFormState> | null>,
	) => {
		create({
			variables: {
				input: {
					data: {
						name: values.name ?? "",
						countAsFullyAllocatedAtPercentage: values.countAsFullyAllocatedAtPercentage,
						countAsOverallocatedAtPercentage: values.countAsOverallocatedAtPercentage,
						useEndDateOfLastAssignmentOverProjectionCap:
							values.useEndDateOfLastAssignmentOverProjectionCap,
						maxNumberOfProjects: values.maxNumberOfProjects,
						sortOrder: values.sortOrder,
						utilizationProjectionCapInMonths: values.utilizationProjectionCapInMonths,
					},
				},
				connectionId,
			},
			onCompleted: (_) => {
				onHide();
			},
		});
	};
	return (
		<FormDialogButton<EditAssignmentRoleFormState>
			buttonContent={{
				label: "Create new assignment role",
			}}
			buttonVariant={"solid"}
			disabled={isCreating}
			title={"Create New Assignment Role"}
		>
			{(ref, onHide) => {
				return (
					<EditAssignmentRoleModal
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide, ref);
						}}
						initialState={{
							name: "",
							sortOrder: 0,
							maxNumberOfProjects: undefined,
							useEndDateOfLastAssignmentOverProjectionCap: undefined,
							countAsOverallocatedAtPercentage: undefined,
							countAsFullyAllocatedAtPercentage: undefined,
							utilizationProjectionCapInMonths: undefined,
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
