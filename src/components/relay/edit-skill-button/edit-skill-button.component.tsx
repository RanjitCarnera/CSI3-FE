import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import { type FormikProps } from "formik/dist/types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import {
	EDIT_MUTATION,
	SKILL_FRAGMENT,
} from "@components/relay/edit-skill-button/edit-skill-button.graphql";
import { type EditSkillButtonProps } from "@components/relay/edit-skill-button/edit-skill-button.types";
import { EditSkillForm } from "@components/relay/edit-skill-button/parts/edit-skill-form";
import { type EditSkillButtonFormState } from "@components/relay/edit-skill-button/parts/edit-skill-form/edit-skill-form.types";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editSkillButton_EditMutation } from "@relay/editSkillButton_EditMutation.graphql";
import type { editSkillButton_SkillFragment$key } from "@relay/editSkillButton_SkillFragment.graphql";

export const EditSkillButton = (props: EditSkillButtonProps) => {
	const skill = useFragment<editSkillButton_SkillFragment$key>(
		SKILL_FRAGMENT,
		props.skillFragmentRef,
	);
	const [edit, _] = useMutation<editSkillButton_EditMutation>(EDIT_MUTATION);
	const handleSubmit = (
		values: EditSkillButtonFormState,
		onHide: () => void,
		ref: React.MutableRefObject<FormikProps<EditSkillButtonFormState> | null>,
	) => {
		const data = {
			name: values.name!,
			skillCategoryRef: values.skillCategoryRef!,
			description: values.description,
		};
		const binaryDimension = {
			binary: {
				kind: "binary",
			},
		};
		const numericalDimension = {
			numerical: {
				kind: "numerical",
				dimensionCount: values.dimensionCount,
				dimensionExplanations: values.dimensionExplanations,
			},
		};
		const dimension = values.dimension === "numerical" ? numericalDimension : binaryDimension;

		edit({
			variables: {
				input: {
					skillId: skill.id,
					data: {
						name: data.name,
						skillCategoryId: data.skillCategoryRef,
						description: data.description,
						dimension,
					},
				},
			},
			onCompleted: (response) => {
				onHide();
			},
		});
	};

	const hasPermissions = useSelector(selectHasPermissions);
	const hasAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);

	if (!hasAccess) return <Fragment />;
	return (
		<FormDialogButton<EditSkillButtonFormState>
			buttonContent={{
				label: "Edit",
				icon: "pi pi-pencil",
			}}
			buttonVariant={"subtle"}
			title={"Edit Skill"}
		>
			{(ref, onHide) => {
				return (
					<EditSkillForm
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide, ref);
						}}
						initialState={{
							name: skill.name,
							description: skill.description ?? "",
							skillCategoryRef: skill.skillCategory?.id,
							dimension: skill.dimension.kind,
							dimensionCount: skill.dimension.dimensionCount ?? 10,
							dimensionExplanations: skill.dimension.dimensionExplanations
								? [...skill.dimension.dimensionExplanations]
								: [],
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
