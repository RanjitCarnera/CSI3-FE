import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import {
	DEFAULT_COLOR_PICKER_COLOR,
	DEFAULT_COLOR_PICKER_COLOR_WITH_HEX,
} from "@components/relay/default-color-picker/default-color-picket.consts";
import { type editProjectStageModal_CreateMutation } from "@relay/editProjectStageModal_CreateMutation.graphql";
import { type editProjectStageModal_EditMutation } from "@relay/editProjectStageModal_EditMutation.graphql";
import { type editProjectStageModal_ProjectStageFragment$key } from "@relay/editProjectStageModal_ProjectStageFragment.graphql";
import {
	CREATE_MUTATION,
	EDIT_MUTATION,
	PERSON_FRAGMENT,
} from "./edit-project-stage-modal.graphql";
import {
	type EditProjectStageModalFormState,
	type EditProjectStageModalProps,
} from "./edit-project-stage-modal.interface";
import { DefaultSwitchComponent, DefaultTextFieldComponent } from "../../ui/DefaultTextInput";
import { TkButton } from "../../ui/TkButton";
import { TkButtonLink } from "../../ui/TkButtonLink";
import { TkDialog } from "../../ui/TkDialog";
import { ValidatedField } from "../../ui/ValidatedField";
import { DefaultColorPickerComponent } from "../default-color-picker";

export const EditProjectStageModal = ({
	projectStageFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: EditProjectStageModalProps) => {
	const projectStage = useFragment<editProjectStageModal_ProjectStageFragment$key>(
		PERSON_FRAGMENT,
		projectStageFragmentRef ?? null,
	);
	const [create] = useMutation<editProjectStageModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<editProjectStageModal_EditMutation>(EDIT_MUTATION);

	const formik = useFormik<EditProjectStageModalFormState>({
		initialValues: {
			name: projectStage?.name ?? "",
			reverseProjectOrderInReports: projectStage?.reverseProjectOrderInReports ?? false,
			sortOrder: projectStage?.sortOrder ?? 0,
			color: projectStage?.color ?? DEFAULT_COLOR_PICKER_COLOR_WITH_HEX,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			if (projectStage) {
				edit({
					variables: {
						input: {
							id: projectStage.id,
							data: {
								name: values.name!,
								reverseProjectOrderInReports:
									values.reverseProjectOrderInReports || false,
								sortOrder: values.sortOrder,
								color: values.color,
							},
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Project.editProjectStage?.edge.node.id!);
						resetForm({});
					},
				});
			} else {
				create({
					variables: {
						input: {
							data: {
								name: values.name!,
								reverseProjectOrderInReports:
									values.reverseProjectOrderInReports || false,
								sortOrder: values.sortOrder,
								color: values.color,
							},
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Project.createProjectStage?.edge.node.id!);
						resetForm({});
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{projectStage ? "Edit project stage" : "Create new project stage"}</h1>}
			visible={isVisible}
			onHide={() => {
				onHide();
			}}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => {
							onHide();
						}}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						label={projectStage ? "Save" : "Create"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<EditProjectStageModalFormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>

				<ValidatedField<EditProjectStageModalFormState, boolean>
					className="mb-4"
					name={"reverseProjectOrderInReports"}
					label={"Reverse Project Order in Reports"}
					required={true}
					formikConfig={formik}
					component={DefaultSwitchComponent}
				/>
				<ValidatedField<EditProjectStageModalFormState, string>
					name={"color"}
					label={"Staffview Bar Color"}
					formikConfig={formik}
					component={DefaultColorPickerComponent}
				/>
				<TkButton
					onClick={(e) => {
						e.preventDefault();
						void formik.setFieldValue("color", DEFAULT_COLOR_PICKER_COLOR);
					}}
					style={{ whiteSpace: "nowrap", width: "min-content" }}
				>
					Reset Color
				</TkButton>
			</Form>
		</TkDialog>
	);
};
