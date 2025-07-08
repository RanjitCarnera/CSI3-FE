import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	EDIT_SKILL_CATEGORY_MUTATION,
	SKILL_CATEGORY_FRAGMENT,
} from "@components/edit-skill-category-button/edit-skill-category-button.graphql";
import { type EditSkillCategoryButtonProps } from "@components/edit-skill-category-button/edit-skill-category-button.types";
import { EditSkillCategoryForm } from "@components/edit-skill-category-form";
import { type EditSkillCategoryFormState } from "@components/edit-skill-category-form/edit-skill-category-form.types";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editSkillCategoryButton_EditSkillCategoryMutation } from "@relay/editSkillCategoryButton_EditSkillCategoryMutation.graphql";
import { type editSkillCategoryButton_SkillCategoryFragment$key } from "@relay/editSkillCategoryButton_SkillCategoryFragment.graphql";

export const EditSkillCategoryButton = ({
	skillCategoryFragmentRef,
}: EditSkillCategoryButtonProps) => {
	const skillCategory = useFragment<editSkillCategoryButton_SkillCategoryFragment$key>(
		SKILL_CATEGORY_FRAGMENT,
		skillCategoryFragmentRef,
	);
	const [editSkillCategory] = useMutation<editSkillCategoryButton_EditSkillCategoryMutation>(
		EDIT_SKILL_CATEGORY_MUTATION,
	);
	const handleSubmit = (values: EditSkillCategoryFormState, onHide: () => void) => {
		editSkillCategory({
			variables: {
				input: {
					data: {
						name: values.name!,
					},
					skillCategoryId: skillCategory.id,
				},
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
				label: "Edit",
				icon: "pi pi-pencil",
			}}
			title={"Edit new attribute category"}
			buttonVariant={"subtle"}
		>
			{(ref, onHide) => {
				return (
					<EditSkillCategoryForm
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide);
						}}
						initialState={{
							name: skillCategory.name,
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
