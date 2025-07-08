import { DeleteButton } from "@thekeytechnology/framework-react-components";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { DELETE_SKILL_CATEGORY_MUTATION } from "@components/delete-skill-categories-button/delete-skill-categories-button.graphql";
import { type DeleteSkillCategoriesButtonProps } from "@components/delete-skill-categories-button/delete-skill-categories-button.types";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type deleteSkillCategoriesButton_DeleteSkillCategoryMutation } from "@relay/deleteSkillCategoriesButton_DeleteSkillCategoryMutation.graphql";

export const DeleteSkillCategoriesButton = ({
	skillCategoryIds,
	connectionIds,
}: DeleteSkillCategoriesButtonProps) => {
	const [remove, isRemoving] =
		useMutation<deleteSkillCategoriesButton_DeleteSkillCategoryMutation>(
			DELETE_SKILL_CATEGORY_MUTATION,
		);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);

	if (!hasAccess) return <Fragment />;
	return (
		<DeleteButton
			isDeleting={isRemoving}
			selectedIds={skillCategoryIds}
			singularName={"Attribute Category"}
			pluralName={"Attribute Categories"}
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
