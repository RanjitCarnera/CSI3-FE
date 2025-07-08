import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { CREATE_SKILL_CATEGORY_MUTATION } from "@components/create-skill-category-button/create-skill-category-button.graphql";
import { type CreateSkillCategoryButtonProps } from "@components/create-skill-category-button/create-skill-category-button.types";
import { EditSkillCategoryForm } from "@components/edit-skill-category-form";
import { type EditSkillCategoryFormState } from "@components/edit-skill-category-form/edit-skill-category-form.types";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type createSkillCategoryButton_CreateSkillCategoryMutation } from "@relay/createSkillCategoryButton_CreateSkillCategoryMutation.graphql";

export const CreateSkillCategoryButton = ({ connectionId }: CreateSkillCategoryButtonProps) => {
	const [createSkillCategory] =
		useMutation<createSkillCategoryButton_CreateSkillCategoryMutation>(
			CREATE_SKILL_CATEGORY_MUTATION,
		);
	const handleSubmit = (values: EditSkillCategoryFormState, onHide: () => void) => {
		createSkillCategory({
			variables: {
				input: {
					data: {
						name: values.name ?? "",
					},
				},
				connections: [connectionId],
			},
			onCompleted: () => {
				onHide();
			},
			onError: () => {
				toast.error("Could not create attribute category.");
			},
		});
	};

	const hasPermissions = useSelector(selectHasPermissions);
	const hasAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);
	if (!hasAccess) return <Fragment />;

	return (
		<FormDialogButton<EditSkillCategoryFormState>
			buttonContent={{
				label: "Create new attribute category",
			}}
			title={"Create new attribute category"}
		>
			{(ref, onHide) => {
				return (
					<EditSkillCategoryForm
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide);
						}}
						initialState={{
							name: "",
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
