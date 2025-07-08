import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import { type FormikProps } from "formik/dist/types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { CREATE_MUTATION } from "@components/relay/create-skill-button/create-skill-button.graphql";
import { EditSkillForm } from "@components/relay/edit-skill-button/parts/edit-skill-form";
import { type EditSkillButtonFormState } from "@components/relay/edit-skill-button/parts/edit-skill-form/edit-skill-form.types";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type createSkillButton_CreateMutation } from "@relay/createSkillButton_CreateMutation.graphql";
import { type CreateSkillButtonProps } from "./create-skill-button.types";

export const CreateSkillButton = (props: CreateSkillButtonProps) => {
	const [create, isCreating] = useMutation<createSkillButton_CreateMutation>(CREATE_MUTATION);
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

		create({
			variables: {
				input: {
					data: {
						name: data.name,
						skillCategoryId: data.skillCategoryRef,
						description: data.description,
						dimension,
					},
				},
				connections: [props.connectionId ?? ""],
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
				label: "Create",
				icon: "pi pi-plus",
			}}
			buttonVariant={"solid"}
			title={"Create Skill"}
		>
			{(ref, onHide) => {
				return (
					<EditSkillForm
						ref={ref}
						onSubmit={(values) => {
							handleSubmit(values, onHide, ref);
						}}
						initialState={{
							name: "",
							description: "",
							skillCategoryRef: "",
							dimension: "binary",
							dimensionCount: 10,
							dimensionExplanations: [],
						}}
					/>
				);
			}}
		</FormDialogButton>
	);
};
