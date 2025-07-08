import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import { type FormikProps } from "formik/dist/types";
import React, { type MutableRefObject } from "react";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { type createTagButton_createTagFromNameMutation } from "@relay/createTagButton_createTagFromNameMutation.graphql";
import { CREATE_TAG_FROM_NAME_MUTATION } from "@screens/tags/parts/create-tag-button/create-tag-button.graphql";
import { type CreateTagFormState } from "@screens/tags/parts/create-tag-button/create-tag-button.types";
import { CreateTagForm } from "@screens/tags/parts/create-tag-button/parts/create-tag-form";

export const CreateTagButton = ({ connections }: { connections: string[] }) => {
	const [create, isCreating] = useMutation<createTagButton_createTagFromNameMutation>(
		CREATE_TAG_FROM_NAME_MUTATION,
	);

	const handleSubmit = (
		values: CreateTagFormState,
		onHide: () => void,
		ref: MutableRefObject<FormikProps<CreateTagFormState> | null>,
	) => {
		create({
			variables: {
				input: {
					name: values.name,
				},
				connections,
			},
			onCompleted: () => {
				onHide();
				toast.success("Tag created.");
			},
		});
	};
	return (
		<FormDialogButton<CreateTagFormState>
			buttonContent={{
				icon: "pi pi-plus",
				iconPosition: "left",
				label: "Create tag",
			}}
			buttonVariant={"solid"}
			disabled={isCreating}
			title={"Create new tag"}
		>
			{(ref, onHide) => {
				return (
					<div style={{ minWidth: 400 }}>
						<CreateTagForm
							ref={ref}
							onSubmit={(values) => {
								handleSubmit(values, onHide, ref);
							}}
							initialState={{
								name: "",
							}}
						/>
					</div>
				);
			}}
		</FormDialogButton>
	);
};
