import { Button, Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { type FormikHelpers, useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import moment from "moment-timezone";
import React, { useImperativeHandle, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Conditional } from "@components/conditional";
import { CUCField } from "@components/cuc-field";
import {
	cucFormValidation,
	DEFAULT_CUC_FIELD_MARKERS,
} from "@components/cuc-field/cuc-field.consts";
import type { CUCFieldRef, MarkerInput } from "@components/cuc-field/cuc-field.types";
import { CUCLayer } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.types";
import { DefaultSetTagsInputField } from "@components/default-set-tags-input-field";
import { type DefaultSetTagsInputInput } from "@components/default-set-tags-input-field/default-set-tags-input-field.types";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";
import { type EditAssignmentForm_AssignmentFragment$key } from "@relay/EditAssignmentForm_AssignmentFragment.graphql";
import { type EditAssignmentForm_GetPercentageForDateOnProjectMutation } from "@relay/EditAssignmentForm_GetPercentageForDateOnProjectMutation.graphql";
import { type EditAssignmentForm_ProjectFragment$key } from "@relay/EditAssignmentForm_ProjectFragment.graphql";
import {
	DefaultCalendarComponent,
	DefaultPercentageFieldComponent,
	DefaultSwitchComponent,
	DefaultTextFieldComponent,
} from "./DefaultTextInput";
import { TkButtonLink } from "./TkButtonLink";
import { ValidatedField, type ValidatedFieldConfig } from "./ValidatedField";
import { AssignmentRolesSelect } from "../relay/AssignmentRolesSelect";
import { PersonSelect } from "../relay/PersonSelect";

const PROJECT_FRAGMENT = graphql`
	fragment EditAssignmentForm_ProjectFragment on Project {
		startDate
		endDate
		...cucField_ProjectFragment
	}
`;

const ASSIGNMENT_FRAGMENT = graphql`
	fragment EditAssignmentForm_AssignmentFragment on Assignment {
		...cucField_AssignmentFragment
	}
`;

export const GET_PERCENTAGE_FOR_DATE_ON_PROJECT_MUTATION = graphql`
	mutation EditAssignmentForm_GetPercentageForDateOnProjectMutation(
		$input: GetPercentageForDateOnProjectInput!
	) {
		Cuc {
			getPercentageForDateOnProject(input: $input) {
				responses {
					isGood
					percentage
				}
			}
		}
	}
`;

export interface EditAssignmentFormState {
	validAssignmentRolesRef?: string[];
	personRef?: string;
	startDate?: string;
	endDate?: string;
	importId?: string;

	isExecutive?: boolean;
	comment?: string;
	weight?: number;
	setTagsInput: DefaultSetTagsInputInput[];

	cuc?: MarkerInput[] | undefined | null;
}

interface OwnProps {
	projectFragmentRef: EditAssignmentForm_ProjectFragment$key;
	assignmentFragmentRef?: EditAssignmentForm_AssignmentFragment$key;
	initialState?: EditAssignmentFormState;
	onSubmit: (
		values: EditAssignmentFormState,
		formikHelpers: FormikHelpers<EditAssignmentFormState>,
	) => void;
	onAssignmentRoleChanged?: (validAssignmentRoleRefs: string[]) => void;
	weightToday?: number;
}

export const EditAssignmentForm = React.forwardRef<
	FormikProps<EditAssignmentFormState> & CUCFieldRef,
	OwnProps
>(({ initialState, onSubmit, projectFragmentRef, weightToday, assignmentFragmentRef }, ref) => {
	const [commit] = useMutation<EditAssignmentForm_GetPercentageForDateOnProjectMutation>(
		GET_PERCENTAGE_FOR_DATE_ON_PROJECT_MUTATION,
	);
	const [isShowingCucField, setIsShowingCucField] = useState(!!initialState?.cuc);

	const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
	const isUsingCUC = activeFeatureToggleIds.includes("CUC");
	const cucFieldRef = useRef<CUCFieldRef>(null);

	const project = useFragment<EditAssignmentForm_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	const assignment = useFragment<EditAssignmentForm_AssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		assignmentFragmentRef ?? null,
	);

	const formik = useFormik<EditAssignmentFormState>({
		initialValues: {
			validAssignmentRolesRef: initialState?.validAssignmentRolesRef ?? undefined,
			personRef: initialState?.personRef ?? undefined,
			startDate: initialState?.startDate ?? undefined,
			endDate: initialState?.endDate ?? undefined,
			importId: initialState?.importId,
			isExecutive: initialState?.isExecutive,
			comment: initialState?.comment,
			weight: initialState?.weight,
			setTagsInput: initialState?.setTagsInput ?? [],
			cuc:
				initialState?.cuc?.sort((a, b) => a.percentageTime - b.percentageTime) ?? undefined,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			validAssignmentRolesRef: Yup.array()
				.min(1, "At least one role is required.")
				.required("Valid roles is a required field."),
			startDate: Yup.string().required("Start date is a required field."),
			endDate: Yup.string()
				.required("Start date is a required field.")
				.test("yourTestCondition", function (value) {
					if (!value) {
						return this.createError({ path: "endDate", message: "" });
					}
					const end = new Date(value);
					const startDateString = this.parent.startDate;

					if (startDateString) {
						const startDate = new Date(startDateString);

						if (startDate > end) {
							return this.createError({
								path: "endDate",
								message: "End date needs to be on or after start date.",
							});
						}
					}
					return true;
				}),
			cuc: isUsingCUC ? cucFormValidation : Yup.array().notRequired(),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
		focus: () => {
			cucFieldRef.current?.focus();
		},
	}));

	const handleOnUpdate = (
		useCase: "startDate" | "endDate",
		renderConfig: ValidatedFieldConfig<string>,
		newValue?: string,
	) => {
		renderConfig.updateField(newValue);

		const startDate = formik.values.startDate
			? moment(useCase === "startDate" ? newValue : formik.values.startDate)
			: null;
		const endDate = formik.values.startDate
			? moment(useCase === "endDate" ? newValue : formik.values.endDate)
			: null;
		if (!startDate || !endDate) return;

		const milestoneMarkers = formik.values.cuc
			?.filter((e) => e.kind === "MilestoneMarker")
			.filter((e) => !!e.milestoneOpt?.date);

		if (!milestoneMarkers?.length) return;

		commit({
			variables: {
				input: {
					mappings:
						milestoneMarkers?.map((e) => ({
							startDate: useCase === "startDate" ? newValue : formik.values.startDate,
							endDate: useCase === "endDate" ? newValue : formik.values.endDate,
							date: e.milestoneOpt?.date!,
						})) ?? [],
				},
			},
			onCompleted: (res) => {
				const responses =
					res.Cuc.getPercentageForDateOnProject?.responses.map((r, i) => {
						return { response: r, index: i };
					}) ?? [];

				const names: string[] = [];
				const newCuc = formik.values.cuc
					?.map((markerInput, index) => {
						const isMilestone = markerInput.kind === "MilestoneMarker";

						if (isMilestone) {
							const matchIndex = milestoneMarkers.findIndex(
								(milestoneMarker) =>
									milestoneMarker.milestoneOpt!.id ===
									markerInput.milestoneOpt!.id,
							);

							if (matchIndex > -1) {
								const response = responses[matchIndex].response;
								if (response.isGood) {
									return {
										...markerInput,
										percentageTime: response.percentage! * 100,
									} as MarkerInput;
								} else {
									names.push(
										milestoneMarkers[matchIndex]?.milestoneOpt?.name ?? "",
									);
									return null;
								}
							} else {
								return markerInput;
							}
						}
						return markerInput;
					})
					.filter((markerInput): markerInput is MarkerInput => markerInput !== null);

				if (names.length)
					toast.warning(
						"Following milestone markers have been removed since they would now lie far outside the bounds of the assignment length: " +
							names.join(", "),
					);
				void formik.setFieldValue("cuc", newCuc);
			},
		});
	};

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<EditAssignmentFormState, string[]>
				className="mb-4"
				name={"validAssignmentRolesRef"}
				label={"Valid Roles"}
				required={true}
				placeholder={"Choose roles"}
				formikConfig={formik}
				component={AssignmentRolesSelect}
			/>
			<ValidatedField<EditAssignmentFormState, boolean>
				className="mb-4"
				name={"isExecutive"}
				label={"Is Executive"}
				required={true}
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>
			<ValidatedField<EditAssignmentFormState, string>
				className="mb-4"
				name={"personRef"}
				label={"Assigned person"}
				formikConfig={formik}
				component={PersonSelect}
			/>

			<TkButtonLink
				className="mb-1"
				type="button"
				label={"Use project's start and end dates"}
				onClick={() => {
					void formik.setFieldValue("startDate", project.startDate);
					void formik.setFieldValue("endDate", project.endDate);
				}}
			/>
			<ValidatedField<EditAssignmentFormState, string>
				className="mb-4"
				name={"startDate"}
				label={"Start date"}
				required={true}
				formikConfig={formik}
				component={(renderConfig) => (
					<DefaultCalendarComponent
						{...renderConfig}
						updateField={(newValue) => {
							handleOnUpdate("startDate", renderConfig, newValue);
						}}
					/>
				)}
			/>
			<ValidatedField<EditAssignmentFormState, string>
				className="mb-4"
				name={"endDate"}
				label={"End date"}
				required={true}
				formikConfig={formik}
				component={(renderConfig) => (
					<DefaultCalendarComponent
						{...renderConfig}
						updateField={(newValue) => {
							handleOnUpdate("endDate", renderConfig, newValue);
						}}
					/>
				)}
			/>
			<ValidatedField<EditAssignmentFormState, string>
				className="mb-4"
				name={"importId"}
				label={"Import ID"}
				helpText={
					"If you're using an external data source, you can specify an external ID here which is used to associate imported data with already imported data."
				}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<EditAssignmentFormState, string>
				className="mb-4"
				name={"comment"}
				label={"Comment"}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>

			<ValidatedField<EditAssignmentFormState, number>
				disabled={isShowingCucField}
				className="mb-4"
				name={"weight"}
				label={"Weight"}
				iconClass="pi pi-percentage"
				helpText={
					"The weight of the assignment determines to what percentage it's counted in the utilization algorithm. "
				}
				formikConfig={formik}
				placeholder={"100%"}
				component={(renderCOnfig) => (
					<DefaultPercentageFieldComponent
						{...renderCOnfig}
						fieldValue={isShowingCucField ? weightToday : renderCOnfig.fieldValue}
					/>
				)}
			/>

			<ValidatedField<EditAssignmentFormState, DefaultSetTagsInputInput[]>
				className="mb-4"
				name={"setTagsInput"}
				label={"Tags"}
				iconClass="pi pi-percentage"
				helpText={"Tags that will be assigned to this assignment."}
				formikConfig={formik}
				placeholder={"Tags..."}
				component={DefaultSetTagsInputField}
			/>

			<WithFeatureToggle featureId={"CUC"}>
				<Conditional.Root condition={isShowingCucField}>
					<Conditional.Success>
						<ValidatedField<EditAssignmentFormState, MarkerInput[]>
							name={"cuc"}
							formikConfig={formik}
							component={(renderConfig) => {
								return (
									<CUCField
										{...renderConfig}
										fieldValue={
											renderConfig.fieldValue ?? DEFAULT_CUC_FIELD_MARKERS
										}
										ref={cucFieldRef}
										dataSetLabel={"CUC"}
										startDate={formik.values.startDate}
										endDate={formik.values.endDate}
										layer={CUCLayer.Layer3}
										projectFragmentRef={project}
										assignmentFragmentRef={assignment ?? undefined}
									/>
								);
							}}
						/>
					</Conditional.Success>
					<Conditional.Fallback>
						<Button
							content={{ label: "Use new weighting feature" }}
							onClick={() => {
								setIsShowingCucField(true);
							}}
						/>
						<div className={"mb-2"}></div>
					</Conditional.Fallback>
				</Conditional.Root>
			</WithFeatureToggle>
		</Form>
	);
});
