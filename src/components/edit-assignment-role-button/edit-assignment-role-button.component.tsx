import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import { type FormikProps } from "formik/dist/types";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import {
	ASSIGNMENT_ROLE_FRAGMENT,
	EDIT_ASSIGNMENT_ROLE_MUTATION,
} from "@components/edit-assignment-role-button/edit-assignment-role-button.graphql";
import { type EditAssignmentRoleButtonProps } from "@components/edit-assignment-role-button/edit-assignment-role-button.types";
import { type EditAssignmentRoleFormState } from "@components/edit-assignment-role-button/parts/edit-assignment-role-form/edit-assignment-role-form.types";
import { type editAssignmentRoleButton_AssignmentRoleFragment$key } from "@relay/editAssignmentRoleButton_AssignmentRoleFragment.graphql";
import { type editAssignmentRoleButton_EditAssignmentRoleMutation } from "@relay/editAssignmentRoleButton_EditAssignmentRoleMutation.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";
import { EditAssignmentRoleModal } from "./parts/edit-assignment-role-form";

export const EditAssignmentRoleButton = ({
	assignmentRoleFragmentRef,
}: EditAssignmentRoleButtonProps) => {
	const assignmentRole = useFragment<editAssignmentRoleButton_AssignmentRoleFragment$key>(
		ASSIGNMENT_ROLE_FRAGMENT,
		assignmentRoleFragmentRef,
	);

	const [edit, isEditing] = useMutation<editAssignmentRoleButton_EditAssignmentRoleMutation>(
		EDIT_ASSIGNMENT_ROLE_MUTATION,
	);

	const handleSubmit = (
		values: EditAssignmentRoleFormState,
		onHide: () => void,
		ref: React.MutableRefObject<FormikProps<EditAssignmentRoleFormState> | null>,
	) => {
		edit({
			variables: {
				input: {
					assignmentRoleId: assignmentRole.id,
					data: {
						name: values.name ?? "",
						countAsFullyAllocatedAtPercentage: values.countAsFullyAllocatedAtPercentage,
						countAsOverallocatedAtPercentage: values.countAsOverallocatedAtPercentage,
						useEndDateOfLastAssignmentOverProjectionCap:
							values.useEndDateOfLastAssignmentOverProjectionCap,
						maxNumberOfProjects: values.maxNumberOfProjects,
						sortOrder: values.sortOrder,
						utilizationProjectionCapInMonths: values.utilizationProjectionCapInMonths,
						cucTemplate: applyFilter(values.cucTemplate),
					},
				},
			},
			onCompleted: () => {
				onHide();
			},
		});
	};
	return (
		<FormDialogButton<EditAssignmentRoleFormState>
			buttonContent={{
				label: "Edit",
				icon: "pi pi-pencil",
				iconPosition: "left",
			}}
			disabled={isEditing}
			buttonVariant={"subtle"}
			title={"Edit assignment role"}
		>
			{(ref, onHide) => {
				return (
					<EditAssignmentRoleModal
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide, ref);
						}}
						initialState={{
							name: assignmentRole.name,
							sortOrder: assignmentRole.sortOrder,
							maxNumberOfProjects: assignmentRole.maxNumberOfProjects ?? undefined,
							useEndDateOfLastAssignmentOverProjectionCap:
								assignmentRole.useEndDateOfLastAssignmentOverProjectionCap ??
								undefined,
							countAsOverallocatedAtPercentage:
								assignmentRole.countAsOverallocatedAtPercentage ?? undefined,
							countAsFullyAllocatedAtPercentage:
								assignmentRole.countAsFullyAllocatedAtPercentage ?? undefined,
							utilizationProjectionCapInMonths:
								assignmentRole.utilizationProjectionCapInMonths ?? undefined,
							cucTemplate: assignmentRole.cucTemplate?.id,
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
