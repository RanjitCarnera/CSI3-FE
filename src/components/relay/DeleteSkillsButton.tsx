import { graphql } from "babel-plugin-relay/macro";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type DeleteSkillsButton_DeleteMutation } from "../../__generated__/DeleteSkillsButton_DeleteMutation.graphql";
import { DeleteButton } from "../ui/DeleteButton";

const REMOVE_MUTATION = graphql`
	mutation DeleteSkillsButton_DeleteMutation($input: DeleteSkillInput!, $connections: [ID!]!) {
		Skills {
			deleteSkill(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;

interface OwmProps {
	connectionIds?: string[];
	skillIds: string[];
	className?: string;
}

export const DeleteSkillsButton = ({ skillIds, connectionIds, className }: OwmProps) => {
	const [remove, isRemoving] = useMutation<DeleteSkillsButton_DeleteMutation>(REMOVE_MUTATION);

	const hasPermissions = useSelector(selectHasPermissions);
	const hasAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);
	if (!hasAccess) return <Fragment />;

	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={skillIds}
			className={className}
			singularName={"Attribute"}
			pluralName={"Attributes"}
			doDelete={(ids) => {
				remove({
					variables: {
						input: {
							ids,
						},
						connections: connectionIds || [],
					},
				});
			}}
		/>
	);
};
