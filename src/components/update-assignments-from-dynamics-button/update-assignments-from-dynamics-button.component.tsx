import { Button } from "@thekeytechnology/framework-react-components";
import React, { type FC, Fragment } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	IMPORT_ASSIGNMENTS_FROM_DYNAMICS_MUTATION,
	SCENARIO_FRAGMENT,
} from "@components/update-assignments-from-dynamics-button/update-assignments-from-dynamics-button.graphql";
import { type UpdateAssignmentsFromDynamicsButtonProps } from "@components/update-assignments-from-dynamics-button/update-assignments-from-dynamics-button.types";
import { selectHasPermissions, selectHasStrictPermissions } from "@redux/CurrentUserSlice";
import { type updateAssignmentsFromDynamicsButton_ImportAssignmentsFromDynamicsMutation } from "@relay/updateAssignmentsFromDynamicsButton_ImportAssignmentsFromDynamicsMutation.graphql";
import { type updateAssignmentsFromDynamicsButton_ScenarioFragment$key } from "@relay/updateAssignmentsFromDynamicsButton_ScenarioFragment.graphql";

export const UpdateAssignmentsFromDynamicsButton: FC<UpdateAssignmentsFromDynamicsButtonProps> = ({
	scenarioFragmentRef,
}) => {
	const hasStrictPermissions = useSelector(selectHasStrictPermissions);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasAccountPermission = hasStrictPermissions(["AccountPermission_Auth_PreConIntegration"]);

	const hasPermission = hasPermissions(["UserInAccountPermission_Precon_Edit"]);

	const scenario = useFragment<updateAssignmentsFromDynamicsButton_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const [update, isUpdating] =
		useMutation<updateAssignmentsFromDynamicsButton_ImportAssignmentsFromDynamicsMutation>(
			IMPORT_ASSIGNMENTS_FROM_DYNAMICS_MUTATION,
		);
	const handleOnClick = () => {
		update({
			variables: {
				input: {
					scenarioId: scenario.id,
				},
			},
			onCompleted: (response) => {
				window.location.reload();
				toast.success("SUCCESS");
			},
			onError: (e) => {
				toast.error(e.name);
			},
		});
	};

	if (!hasAccountPermission) return <Fragment />;
	return (
		<Button
			onClick={handleOnClick}
			content={{ label: isUpdating ? "Updating..." : "Update Assignments" }}
			disabled={isUpdating || !hasPermission}
		/>
	);
};
