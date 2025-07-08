import { Button, Icon } from "@thekeytechnology/framework-react-components";
import debounce from "lodash.debounce";
import { Button as PrButton } from "primereact/button";
import { Column } from "primereact/column";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, useMutation, usePaginationFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DateDisplay } from "@components/ui/DateTimeDisplay";
import { TkDataTable } from "@components/ui/TkDataTable";
import {
	selectSkillAssessmentsFilters,
	type SkillAssessmentsFilters,
} from "@redux/skill-assessments.slice";
import {
	type skillAssessmentsTable_AssessmentInlineFragment$data,
	type skillAssessmentsTable_AssessmentInlineFragment$key,
} from "@relay/skillAssessmentsTable_AssessmentInlineFragment.graphql";
import { type skillAssessmentsTable_AssessmentsFragment$key } from "@relay/skillAssessmentsTable_AssessmentsFragment.graphql";
import { type skillAssessmentsTable_Query } from "@relay/skillAssessmentsTable_Query.graphql";
import { type skillAssessmentsTable_Refetch } from "@relay/skillAssessmentsTable_Refetch.graphql";

import { type skillAssessmentsTable_TestAssessmentFinalizationMutation } from "@relay/skillAssessmentsTable_TestAssessmentFinalizationMutation.graphql";
import { DeleteAssessmentsButton } from "@screens/skill-assessments/parts/skill-assessments-table/delete-assessments-button";
import {
	ASSESSMENT_FRAGMENT,
	FINALIZE_TEST_MUTATION,
	QUERY,
	QUERY_FRAGMENT,
} from "@screens/skill-assessments/parts/skill-assessments-table/skill-assessments-table.graphql";

import {
	ActionsWrapper,
	ActionWrapper,
	ProgressWrapper,
} from "@screens/skill-assessments/parts/skill-assessments-table/skill-assessments-table.styles";
import { withoutEventPropagation } from "@utils/table.utils";
import { SKILL_ASSESSMENT_PATH_WITH_ID } from "@screens/skill-assessment/skill-assessment.consts";
import { RevertToAssessmentButton } from "@screens/skill-assessments/parts/revert-to-assessment-button/revert-to-assessment-button.component";
import { type SkillAssessmentsTableProps } from "./skill-assessments-table.types";

export const SkillAssessmentsTable = ({ ...props }: SkillAssessmentsTableProps) => {
	const filters = useSelector(selectSkillAssessmentsFilters);
	const [test, _] =
		useMutation<skillAssessmentsTable_TestAssessmentFinalizationMutation>(
			FINALIZE_TEST_MUTATION,
		);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<skillAssessmentsTable_Query>(QUERY, { first: 250, ...filters });

	const {
		data: {
			Admin: {
				Assessment: {
					Assessments: { __id, edges: assessmentEdges },
				},
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<
		skillAssessmentsTable_Refetch,
		skillAssessmentsTable_AssessmentsFragment$key
	>(QUERY_FRAGMENT, data);

	const assessments = useMemo(
		() =>
			assessmentEdges?.map((e) =>
				readInlineData<skillAssessmentsTable_AssessmentInlineFragment$key>(
					ASSESSMENT_FRAGMENT,
					e!.node,
				),
			),
		[assessmentEdges],
	);

	const debouncedRefetch = (filters: SkillAssessmentsFilters) => {
		refetch({ ...filters, first: 250 }, { fetchPolicy: "network-only" });
	};

	const debouncedEventHandler = useMemo(
		() => debounce(debouncedRefetch, 1000),
		// eslint-disable-next-line
		[],
	);

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else {
			debouncedEventHandler(filters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	const createDownloadOnClick =
		(assessment: skillAssessmentsTable_AssessmentInlineFragment$data) => () => {
			if (!assessment.status.file?.url) return toast.error("Could not download pdf.");

			const link = document.createElement("a");
			link.target = "_blank";
			link.download = assessment.status.file.name;
			link.href = assessment.status.file.url;
			link.click();
		};
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);
	const navigate = useNavigate();
	const handleOnClick = () => {
		const accountId = data.Viewer.Auth.currentAccount?.id;
		if (!accountId) return;
		navigate(SKILL_ASSESSMENT_PATH_WITH_ID(accountId));
	};

	return (
		<>
			<ActionWrapper>
				<Button
					content={{
						label: "Landing page",
						icon: "pi pi-arrow-up-right",
					}}
					onClick={handleOnClick}
				/>
				<DeleteAssessmentsButton
					assessmentIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</ActionWrapper>
			<TkDataTable
				selectionMode="multiple"
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no assessments yet.</div>
					</div>
				}
				className="mb-3"
				value={assessments}
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
				<Column
					header="Progress"
					sortable
					sortField={"status.kind"}
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						const isCompleted = row.status.kind === "PdfGenerated";

						const icon = isCompleted ? "check" : "horizontal-menu";
						const tooltip = isCompleted ? "Completed." : "In progress.";
						return (
							<ProgressWrapper>
								<Icon icon={icon} tooltipOptions={{ content: tooltip }} />
							</ProgressWrapper>
						);
					}}
				/>
				<Column
					header="Employee Name"
					sortable
					sortField={"person.name"}
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						return row.person?.name;
					}}
				/>
				<Column
					header="Assessment Name"
					sortable
					sortField={"template.name"}
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						return row.template?.name;
					}}
				/>
				<Column
					header="Manager Name"
					sortable
					sortField={"supervisor.name"}
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						return row.supervisor?.name ?? "N/A";
					}}
				/>
				<Column
					header="Created Date"
					sortable
					sortField={"createdAt"}
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						return <DateDisplay value={row.createdAt} />;
					}}
				/>
				<Column
					header="Finished Date"
					sortable
					sortField={"status.finishedAt"}
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						return row.status.finishedAt ? (
							<DateDisplay value={row.status.finishedAt} />
						) : (
							"N/A"
						);
					}}
				/>

				<Column
					header="Actions"
					body={(row: skillAssessmentsTable_AssessmentInlineFragment$data) => {
						const hasDownloadButton = row.status.kind === "PdfGenerated";
						return withoutEventPropagation(
							<ActionsWrapper>
								{hasDownloadButton && (
									<Button
										content={{ icon: "pi pi-download" }}
										onClick={createDownloadOnClick(row)}
										inputVariant={"subtle"}
										tooltip={{ content: "Download", position: "right" }}
									/>
								)}
								<RevertToAssessmentButton assessmentFragmentRef={row} />
							</ActionsWrapper>,
						);
					}}
				/>
			</TkDataTable>

			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<PrButton
						type="button"
						className="p-button-secondary"
						disabled={!hasNext}
						onClick={() => loadNext(20)}
					>
						Load more
					</PrButton>
				</div>
			)}
		</>
	);
};
