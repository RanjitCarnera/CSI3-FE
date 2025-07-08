import { FormDialogButton } from "@thekeytechnology/framework-react-components";
import type { FormikProps } from "formik/dist/types";
import React, { type MutableRefObject } from "react";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { type editTagButton_editTagDataMutation } from "@relay/editTagButton_editTagDataMutation.graphql";
import { type editTagButton_TagFragment$key } from "@relay/editTagButton_TagFragment.graphql";
import {
	EDIT_TAG_DATA_MUTATION,
	TAG_FRAGMENT,
} from "@screens/tags/parts/edit-tag-button/edit-tag-button.graphql";
import { type EditTagButtonProps } from "@screens/tags/parts/edit-tag-button/edit-tag-button.types";
import { EditTagForm } from "@screens/tags/parts/edit-tag-button/parts/edit-tag-form";
import { type EditTagFormState } from "@screens/tags/parts/edit-tag-button/parts/edit-tag-form/edit-tag-form.types";

export const EditTagButton = ({ tagFragmentRef }: EditTagButtonProps) => {
	const [edit, isEditing] =
		useMutation<editTagButton_editTagDataMutation>(EDIT_TAG_DATA_MUTATION);
	const tag = useFragment<editTagButton_TagFragment$key>(TAG_FRAGMENT, tagFragmentRef);

	const handleSubmit = (
		values: EditTagFormState,
		onHide: () => void,
		ref: MutableRefObject<FormikProps<EditTagFormState> | null>,
	) => {
		edit({
			variables: {
				input: {
					data: {
						name: values.name,
						color: values.color,
					},
					tagId: tag.id,
				},
			},
			onCompleted: () => {
				onHide();
				toast.success("Tag edited.");
			},
		});
	};
	return (
		<FormDialogButton<EditTagFormState>
			buttonContent={{
				icon: "pi pi-pencil",
			}}
			buttonVariant={"subtle"}
			disabled={isEditing}
			title={"Edit tag"}
		>
			{(ref, onHide) => {
				return (
					<div style={{ minWidth: 400 }}>
						<EditTagForm
							ref={ref}
							onSubmit={(values) => {
								handleSubmit(values, onHide, ref);
							}}
							initialState={{
								name: tag.data.name,
								color: tag.data.color,
							}}
						/>
					</div>
				);
			}}
		</FormDialogButton>
	);
};
