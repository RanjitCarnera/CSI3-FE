import { Button, Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { readInlineData, useFragment, useMutation } from "react-relay";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import type { MarkerInput } from "@components/cuc-field/cuc-field.types";
import {
	convertCUCToMarkerInputs,
	convertMarkerInputsToCUCInput,
} from "@components/cuc-field/cuc-field.utils";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import { TkMessage } from "@components/ui/TkMessage";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { cucSchemaLayer2 } from "@screens/cuc-templates/parts/edit-cuc-template-form/edit-cuc-template-form.consts";
import { type FormFactoryFormState } from "@utils/form-factory";
import { AssignmentRoleAssociationField } from "./AssignmentRoleAssociationField";
import { type EditStaffingTemplateModal_CreateMutation } from "../../__generated__/EditStaffingTemplateModal_CreateMutation.graphql";
import {
	type AssignmentRoleAssociationInput,
	type EditStaffingTemplateModal_EditMutation,
} from "../../__generated__/EditStaffingTemplateModal_EditMutation.graphql";
import { type EditStaffingTemplateModal_StaffingTemplateFragment$key } from "../../__generated__/EditStaffingTemplateModal_StaffingTemplateFragment.graphql";
import { DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField } from "../ui/ValidatedField";

const STAFFING_TEMPLATE_FRAGMENT = graphql`
	fragment EditStaffingTemplateModal_StaffingTemplateFragment on StaffingTemplate {
		id
		name
		assignmentRoleAssociations {
			assignmentRoleRef
			isExecutive
			cucOpt {
				...EditAssignmentButton_CUCInlineFragment
			}
		}
	}
`;

const CREATE_MUTATION = graphql`
	mutation EditStaffingTemplateModal_CreateMutation(
		$input: CreateStaffingTemplateInput!
		$connections: [ID!]!
	) {
		Template {
			createStaffingTemplate(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...EditStaffingTemplateButton_StaffingTemplateFragment
					}
				}
			}
		}
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditStaffingTemplateModal_EditMutation($input: EditStaffingTemplateInput!) {
		Template {
			editStaffingTemplate(input: $input) {
				edge {
					node {
						id
						...EditStaffingTemplateButton_StaffingTemplateFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	staffingTemplateFragmentRef?: EditStaffingTemplateModal_StaffingTemplateFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

export interface AssignmentRoleAssociationInputWithCuc {
	assignmentRoleRef: string;
	isExecutive?: boolean;
	cuc?: MarkerInput[];
}

type FormState = FormFactoryFormState<typeof formSchema>;

const assignmentRoleAssociationWithCucTypeSchema = z
	.object({
		assignmentRoleRef: z.string(),
		isExecutive: z.boolean().optional().nullish().nullable(),
		cuc: cucSchemaLayer2.optional().nullish().nullable(),
	})
	.superRefine((values, ctx) => {
		if ((values?.cuc?.length ?? 0) <= 2) return;
		const sorted = values.cuc?.sort((a, b) => a.percentageTime - b.percentageTime);
		const firstMarker = sorted?.slice().shift();
		const lastMarker = sorted?.slice().reverse().shift();
		if (!firstMarker) return;
		if (!lastMarker) return;

		const firstMarkerIsStart =
			firstMarker.kind === "CustomMarker" && firstMarker.name === "Start";
		const lastMarkerIsEnd = lastMarker.kind === "CustomMarker" && lastMarker.name === "Finish";

		if (!firstMarkerIsStart || !lastMarkerIsEnd) {
			ctx.addIssue({
				code: "custom",
				message:
					"The first marker always has to be the Start marker and the last marker has to always be the Finish marker.",
				path: ["cuc"],
			});
		}
	});
const formSchema = z
	.object({
		name: z.string(),
		assignmentRoleAssociations: z
			.array(assignmentRoleAssociationWithCucTypeSchema)
			.min(1, "At least one assignment role is required."),
	})
	.superRefine((values, ctx) => {
		if (!values) return true;
		const allMarkers = values.assignmentRoleAssociations.flatMap((e) => e.cuc ?? []);
		const simpleMarkers = allMarkers.filter((e) => e.kind === "SimpleMarker");
		const simpleMarkerNames = simpleMarkers.map((e) => e.name?.toLowerCase() ?? "");
		const hasUniqueNames = new Set(simpleMarkerNames).size === simpleMarkerNames.length;
		if (!hasUniqueNames) {
			ctx.addIssue({
				code: "custom",
				path: ["assignmentRoleAssociations"],
				message:
					"You cannot have a marker with the same name on different assignments. Maybe create a milestone template and import that one on both.",
			});
			return false;
		}
		return true;
	});

export const EditStaffingTemplateModal = ({
	staffingTemplateFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const staffingTemplate = useFragment<EditStaffingTemplateModal_StaffingTemplateFragment$key>(
		STAFFING_TEMPLATE_FRAGMENT,
		staffingTemplateFragmentRef ?? null,
	);
	const [create] = useMutation<EditStaffingTemplateModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<EditStaffingTemplateModal_EditMutation>(EDIT_MUTATION);

	const initialValues: FormState = useMemo(() => {
		const assignmentRoleAssociations: FormState["assignmentRoleAssociations"] =
			staffingTemplate?.assignmentRoleAssociations?.map((association) => {
				const explicitCucOpt = readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
					CUC_INLINE_FRAGMENT,
					association.cucOpt,
				);
				return {
					isExecutive: association.isExecutive,
					assignmentRoleRef: association.assignmentRoleRef,
					cuc: convertCUCToMarkerInputs(explicitCucOpt),
				} as FormState["assignmentRoleAssociations"][number];
			}) ?? [];

		return {
			name: staffingTemplate?.name ?? "",
			assignmentRoleAssociations,
		};
	}, [staffingTemplate]);

	const formik = useFormik<FormState>({
		initialValues,
		enableReinitialize: true,
		validationSchema: toFormikValidationSchema(formSchema),
		onSubmit: (values, { setSubmitting, resetForm, ...helpers }) => {
			void helpers.validateForm(values).then((errors) => {});
			if (staffingTemplate) {
				edit({
					variables: {
						input: {
							staffingTemplateId: staffingTemplate.id,
							data: {
								name: values.name!,
								assignmentRoleAssociations: values.assignmentRoleAssociations?.map(
									(e) =>
										({
											assignmentRoleRef: e.assignmentRoleRef,
											isExecutive: e.isExecutive,
											cucOpt: convertMarkerInputsToCUCInput(
												e.cuc as MarkerInput[] | null | undefined,
											),
										}) as AssignmentRoleAssociationInput,
								)!,
							},
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Template.editStaffingTemplate?.edge.node.id!);
						resetForm({});
					},
				});
			} else {
				create({
					variables: {
						input: {
							data: {
								name: values.name!,
								assignmentRoleAssociations: values.assignmentRoleAssociations?.map(
									(e) =>
										({
											assignmentRoleRef: e.assignmentRoleRef,
											isExecutive: e.isExecutive,
											cucOpt: convertMarkerInputsToCUCInput(
												e.cuc as MarkerInput[] | undefined | null,
											),
										}) as AssignmentRoleAssociationInput,
								)!,
							},
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted &&
							onCompleted(response.Template.createStaffingTemplate?.edge.node.id!);
						resetForm({});
					},
				});
			}
		},
	});

	const [formIssues, setFormIssues] = useState<Array<[number, string]>>([]);

	return (
		<TkDialog
			dismissableMask={true}
			header={
				<h1>
					{staffingTemplate ? "Edit Staffing Template" : "Create new Staffing Template"}
				</h1>
			}
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
							if (Object.keys(formik.errors).length > 0) {
								void formik.validateForm().then((errors) => {
									if (Object.keys(errors).length > 0) {
										setFormIssues(generateIssues(formik.values));
									} else {
										formik.handleSubmit();
									}
								});
							} else {
								formik.handleSubmit();
							}
						}}
						label={staffingTemplate ? "Save" : "Create"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit} style={{ width: "65vw" }}>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>

				<ValidatedField<FormState, AssignmentRoleAssociationInputWithCuc[]>
					className="mb-4"
					name={"assignmentRoleAssociations"}
					label={"Assignment Roles"}
					required={true}
					formikConfig={formik}
					component={AssignmentRoleAssociationField}
				/>
			</Form>
			{!!formIssues.length && (
				<TkDialog
					header={"Cannot submit. Tackle the following issues."}
					onHide={() => {
						setFormIssues([]);
					}}
					visible
				>
					<TkMessage
						className="mb-3 w-12"
						content={
							<div>
								<div>
									<h4>Form issues</h4>
									{formIssues.map(([index, message]) => (
										<div>
											<strong>{index}: </strong>
											{message}
										</div>
									))}
								</div>
							</div>
						}
					/>
					<Button
						content={{ label: "Close" }}
						onClick={() => {
							setFormIssues([]);
						}}
					/>
				</TkDialog>
			)}
		</TkDialog>
	);
};

const generateIssues = (values: z.infer<typeof formSchema>) => {
	const itemsInQuestion = formSchema
		.safeParse(values)
		.error?.errors.filter((e) => e.path.shift() === "assignmentRoleAssociations");
	const map: Array<[number, string]> =
		itemsInQuestion?.flatMap((e) => [
			e.path[0] ? [+e.path[0] + 1, e.message] : [1, e.message],
		]) ?? [];

	return map;
};
