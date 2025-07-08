import React from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { type WriteAssigmentsToDynamicsButtonProps } from "./write-assigments-to-dynamics-button.interface";
import { WRITE_ASSIGNMENTS_TO_DYNAMICS_MUTATION } from "./write-assignments-to-dynamics-button.graphql";
import { type writeAssignmentsToDynamicsButton_WriteMutation } from "../../../__generated__/writeAssignmentsToDynamicsButton_WriteMutation.graphql";
import DynamicsIcon from "../../../assets/dynamics-icon.png";
import { selectHasPermissions } from "../../../redux/CurrentUserSlice";
import { TkButton } from "../../ui/TkButton";

export const WriteAssignmentToDynamicsButton = ({
	projectIds,
	className,
}: WriteAssigmentsToDynamicsButtonProps) => {
	const [sync, isWriting] = useMutation<writeAssignmentsToDynamicsButton_WriteMutation>(
		WRITE_ASSIGNMENTS_TO_DYNAMICS_MUTATION,
	);

	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Auth_Field",
	]);
	return hasPermission ? (
		<>
			<TkButton
				className={className}
				icon={<img alt="dynamics" src={DynamicsIcon} height={16} width={16} />}
				iconPos="left"
				tooltip={"Write assignments assignments to dynamics"}
				label={
					isWriting
						? "Writing..."
						: (projectIds?.length || 0) > 0
						? `Write ${projectIds?.length} project(s) to dynamics`
						: "Write projects to dynamics"
				}
				disabled={isWriting || !projectIds || projectIds.length === 0}
				onClick={() =>
					sync({
						variables: {
							input: {
								projectIds: projectIds!,
							},
						},
						onCompleted: () => {
							toast.success("Assignments have been written to dynamics.");
						},
					})
				}
			/>
		</>
	) : null;
};
