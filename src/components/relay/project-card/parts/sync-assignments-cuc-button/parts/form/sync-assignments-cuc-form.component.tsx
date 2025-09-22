import type { DefaultFormProps } from "@thekeytechnology/framework-react-components";
import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import type { FormikProps } from "formik/dist/types";
import React, { Fragment, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import * as Yup from "yup";
import { Conditional } from "@components/conditional";
import { FormField } from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.component";
import { type SyncAssignmentWithCucInput } from "@components/relay/project-card/parts/sync-assignments-cuc-button/parts/form-field/form-field.types";
import { ValidatedField } from "@components/ui/ValidatedField";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";
import { type syncAssignmentsCucForm_ProjectInScenarioFragment$key } from "@relay/syncAssignmentsCucForm_ProjectInScenarioFragment.graphql";
import { PROJECT_IN_SCENARIO_FRAGMENT } from "./sync-assignments-cuc-form.graphql";

export interface SyncAssignmentsCucFormState {
	syncAssignments: SyncAssignmentWithCucInput[];
}

export const SyncAssignmentsCucForm = React.forwardRef<
	FormikProps<SyncAssignmentsCucFormState>,
	DefaultFormProps<SyncAssignmentsCucFormState> & {
		projectInScenarioFragmentRef: syncAssignmentsCucForm_ProjectInScenarioFragment$key;
		initialValuesWithDefaultCucTemplates: SyncAssignmentWithCucInput[];
	}
>(
	(
		{
			initialState,
			onSubmit,
			projectInScenarioFragmentRef,
			initialValuesWithDefaultCucTemplates,
		},
		ref,
	) => {
		const projectInScenarioFragment =
			useFragment<syncAssignmentsCucForm_ProjectInScenarioFragment$key>(
				PROJECT_IN_SCENARIO_FRAGMENT,
				projectInScenarioFragmentRef,
			);
		const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
		const isUsingCUC = activeFeatureToggleIds.includes("CUC");

		const formik = useFormik<SyncAssignmentsCucFormState>({
			initialValues: initialState ?? {
				syncAssignments: [],
			},
			enableReinitialize: true,
			validationSchema: Yup.object().shape({
				syncAssignments: Yup.array(
					Yup.object().shape({
						shouldSync: Yup.boolean(),
						assignmentId: Yup.string(),
						cucTemplateRef: Yup.string().optional(),
					}),
				).test("atleastOnSelected", function (value) {
					const shouldSyncs = (value ?? []).filter((e) => !!e.cucTemplateRef);
					if (!value || shouldSyncs.length === 0) {
						return this.createError({
							path: "syncAssignments",
							message: "Please select a cuc template for at least 1 assignment.",
						});
					}
					return true;
				}),
			}),
			onSubmit,
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<Conditional.Root condition={isUsingCUC}>
				<Conditional.Success>
					<Form onSubmit={formik.handleSubmit}>
						<ValidatedField<SyncAssignmentsCucFormState, SyncAssignmentWithCucInput[]>
							className="mb-4"
							name={"syncAssignments"}
							label={"Sync assignments"}
							required={true}
							formikConfig={formik}
							component={(renderConfig) => (
								<FormField
									{...renderConfig}
									initialValuesWithDefaultCucTemplates={
										initialValuesWithDefaultCucTemplates
									}
									initialValues={initialState}
									projectInScenarioFragmentRef={projectInScenarioFragment}
								/>
							)}
						/>
					</Form>
				</Conditional.Success>
				<Conditional.Fallback>
					<Fragment />
				</Conditional.Fallback>
			</Conditional.Root>
		);
	},
);
