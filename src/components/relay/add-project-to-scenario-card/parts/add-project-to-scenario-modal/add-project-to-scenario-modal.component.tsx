import { Button } from "@thekeytechnology/framework-react-components";
import { type FormikProps } from "formik/dist/types";
import { TabPanel } from "primereact/tabview";
import React, { useRef, useState } from "react";
import { useFragment, useMutation } from "react-relay";
import { FooterWrapper } from "@components/relay/add-project-to-scenario-card/parts/add-project-to-scenario-modal/add-project-to-scenario-modal.styles";
import { useProjectViewFilters } from "@screens/project-view/project-view.utils";
import {
	ADD_EXISTING_MUTATION,
	ADD_NEW_MUTATION,
	SCENARIO_FRAGMENT,
} from "./add-project-to-scenario-modal.graphql";
import { type AddProjectToScenarioModalProps } from "./add-project-to-scenario-modal.interface";
import { type addProjectToScenarioModal_AddExistingMutation } from "../../../../../__generated__/addProjectToScenarioModal_AddExistingMutation.graphql";
import { type addProjectToScenarioModal_AddNewMutation } from "../../../../../__generated__/addProjectToScenarioModal_AddNewMutation.graphql";
import { type addProjectToScenarioModal_ScenarioFragment$key } from "../../../../../__generated__/addProjectToScenarioModal_ScenarioFragment.graphql";
import { EditProjectForm, type EditProjectFormState } from "../../../../ui/edit-project-form";
import {
	SelectProjectsForm,
	type SelectProjectsFormState,
} from "../../../../ui/SelectProjectsForm";
import { TkDialog } from "../../../../ui/TkDialog";
import { TkTabView } from "../../../../ui/TkTabView";

export const AddProjectsToScenarioModal = ({
	scenarioFragmentRef,
	isVisible,
	onHide,
}: AddProjectToScenarioModalProps) => {
	const newRef = useRef<FormikProps<EditProjectFormState>>(null);
	const formik = useRef<FormikProps<SelectProjectsFormState>>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const scenario = useFragment<addProjectToScenarioModal_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);

	const [addNew] = useMutation<addProjectToScenarioModal_AddNewMutation>(ADD_NEW_MUTATION);
	const [addExisting] =
		useMutation<addProjectToScenarioModal_AddExistingMutation>(ADD_EXISTING_MUTATION);

	const projectViewFilters = useProjectViewFilters();

	return (
		<TkDialog
			header={<h1>{"Add project to scenario"}</h1>}
			dismissableMask={true}
			visible={isVisible}
			onHide={() => {
				onHide();
			}}
			footer={
				<FooterWrapper>
					<Button
						disabled={newRef.current?.isSubmitting || formik.current?.isSubmitting}
						onClick={() => {
							onHide();
						}}
						content={{ label: "Cancels" }}
						inputVariant={"subtle"}
					/>
					<Button
						disabled={newRef.current?.isSubmitting || formik.current?.isSubmitting}
						onClick={() => {
							if (activeIndex === 0) {
								newRef.current?.handleSubmit();
							} else {
								formik.current?.handleSubmit();
							}
						}}
						content={{ label: "Assign" }}
						inputVariant={"subtle"}
					/>
				</FooterWrapper>
			}
		>
			<TkTabView
				activeIndex={activeIndex}
				onTabChange={(e) => {
					setActiveIndex(e.index);
				}}
			>
				<TabPanel header={"Create new project"}>
					<EditProjectForm
						ref={newRef}
						onSubmit={(values, { setSubmitting, resetForm }) => {
							addNew({
								variables: {
									input: {
										scenarioId: scenario.id,
										data: {
											name: values.name!,
											address: values.address,
											architectName: values.architectName,
											clientName: values.clientName,
											stageId: values.stageRef!,
											volume: values.volume!,
											startDate: values.startDate!,
											endDate: values.endDate!,
											projectIdentifier: values.projectIdentifier,
											avatarId: values.avatarRef,
											skillsIds: values.skillsRef || [],
											comments: values.comments,
											regionId: values.regionRef,
											divisionId: values.divisionRef,
											budgetedLaborCosts: values.budgetedLaborCosts,
											generalConditionsPercentage:
												values.generalConditionsPercentage,
										},
										milestoneCreationData: {
											milestoneIds: [],
											creationData:
												values.milestones?.map((m) => ({
													date: m.date,
													name: m.name,
												})) ?? [],
										},
									},
									projectFilters: projectViewFilters.projectFilters,
									personOnAssignmentFilters:
										projectViewFilters.personOnAssignmentFilters,
									connectionIds: [],
								},
								onCompleted: () => {
									resetForm({});
									setSubmitting(false);
									onHide();
								},
								onError: () => {
									setSubmitting(false);
								},
								onUnsubscribe: () => {
									setSubmitting(false);
								},
							});
						}}
					/>
				</TabPanel>
				<TabPanel header={"Assign existing projects"}>
					<SelectProjectsForm
						excludeIds={scenario.projects?.edges?.map((e) => e!.node.id) || []}
						ref={formik}
						onSubmit={(values, { resetForm }) => {
							addExisting({
								variables: {
									input: {
										scenarioId: scenario.id,
										projectIds: values.projectIds!,
									},
									projectFilters: projectViewFilters.projectFilters,
									personOnAssignmentFilters:
										projectViewFilters.personOnAssignmentFilters,
								},
								onCompleted: () => {
									resetForm({});
									formik.current?.setSubmitting(false);
									onHide();
								},
								onError: () => {
									formik.current?.setSubmitting(false);
								},
								onUnsubscribe: () => {
									formik.current?.setSubmitting(false);
								},
							});
						}}
					/>
				</TabPanel>
			</TkTabView>
		</TkDialog>
	);
};
