import { Button, DialogButton } from "@thekeytechnology/framework-react-components";
import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button as PrButton } from "primereact/button";
import { Column } from "primereact/column";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, useMutation, usePaginationFragment } from "react-relay";
import { toast } from "react-toastify";
import { DEFAULT_COLOR_PICKER_COLOR_WITH_HEX } from "@components/relay/default-color-picker/default-color-picket.consts";
import { type ProjectStagesTable_setUseStagesColorForProjectNamesMutation } from "@relay/ProjectStagesTable_setUseStagesColorForProjectNamesMutation.graphql";
import { withoutEventPropagation } from "@utils/table.utils";
import { useUseStageColorsForProjectNames } from "@utils/use-stage-colors-for-project-names.hook";
import { CreateProjectStageButton } from "./create-project-stage-button";
import { DefaultColorPickerComponent } from "./default-color-picker";
import { DeleteProjectStagesButton } from "./DeleteProjectStagesButton";
import { EditProjectStageButton } from "./edit-project-stage-button";
import { ExportProjectStagesButton } from "./ExportProjectStagesButton";
import { ImportProjectStagesButton } from "./ImportProjectStagesButton";
import { ProjectStageSortOrderButtons } from "./ProjectStageSortOrderButtons";
import {
	type ProjectStagesTable_ProjectStageFragment$data,
	type ProjectStagesTable_ProjectStageFragment$key,
} from "../../__generated__/ProjectStagesTable_ProjectStageFragment.graphql";
import { type ProjectStagesTable_ProjectStageListFragment$key } from "../../__generated__/ProjectStagesTable_ProjectStageListFragment.graphql";
import { type ProjectStagesTable_Query } from "../../__generated__/ProjectStagesTable_Query.graphql";
import { type ProjectStagesTable_Refetch } from "../../__generated__/ProjectStagesTable_Refetch.graphql";
import { type ProjectStageFilters, selectProjectStageFilters } from "../../redux/ProjectStageSlice";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query ProjectStagesTable_Query($first: Int, $filterByName: String) {
		...ProjectStagesTable_ProjectStageListFragment
			@arguments(first: $first, filterByName: $filterByName)
	}
`;

const PROJECTS_FRAGMENT = graphql`
	fragment ProjectStagesTable_ProjectStageListFragment on Query
	@refetchable(queryName: "ProjectStagesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Project {
			ProjectStages(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "ProjectStagesTable_ProjectStages") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						...ProjectStagesTable_ProjectStageFragment
					}
				}
			}
		}
	}
`;

const PROJECT_STAGE_FRAGMENT = graphql`
	fragment ProjectStagesTable_ProjectStageFragment on ProjectStage @inline {
		id
		name
		sortOrder
		reverseProjectOrderInReports
		color
		...ProjectStageSortOrderButtons_ProjectStageFragment
		...editProjectStageButton_ProjectStageFragment
	}
`;

const SET_USE_STAGES_COLOR_FOR_PROJECT_NAMES_MUTATION = graphql`
	mutation ProjectStagesTable_setUseStagesColorForProjectNamesMutation(
		$input: SetUseStagesColorForProjectNamesInput!
	) {
		Admin {
			Auth {
				setUseStagesColorForProjectNames(input: $input) {
					clientMutationId
				}
			}
		}
	}
`;

export const ProjectStagesTable = () => {
	const filters = useSelector(selectProjectStageFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<ProjectStagesTable_Query>(QUERY, { first: 20, ...filters });
	const [projectStages, setProjectStages] = useState<
		ProjectStagesTable_ProjectStageFragment$data[]
	>([]);
	const {
		data: {
			Project: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				ProjectStages: { __id, edges },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<
		ProjectStagesTable_Refetch,
		ProjectStagesTable_ProjectStageListFragment$key
	>(PROJECTS_FRAGMENT, data);

	useEffect(() => {
		setProjectStages(() =>
			edges!.map((e) =>
				readInlineData<ProjectStagesTable_ProjectStageFragment$key>(
					PROJECT_STAGE_FRAGMENT,
					e!.node!,
				),
			),
		);
	}, [edges]);

	const debouncedRefetch = (filters: ProjectStageFilters) => {
		refetch({ ...filters, first: 20 }, { fetchPolicy: "network-only" });
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
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);

	const useProjectStageColors = useUseStageColorsForProjectNames();

	const [commit, isInFlight] =
		useMutation<ProjectStagesTable_setUseStagesColorForProjectNamesMutation>(
			SET_USE_STAGES_COLOR_FOR_PROJECT_NAMES_MUTATION,
		);

	return (
		<>
			<div className="flex justify-content-end gap-2">
				<DialogButton
					title={"Use stage colors in project view"}
					buttonContent={{
						label: `${
							useProjectStageColors ? "Disable" : "Enable"
						} project stage colors`,
						icon: `pi ${!useProjectStageColors ? "pi-stop" : "pi-check-square"}`,
						iconPosition: "left",
					}}
					dialogFooter={(onHide) => (
						<Button
							inputVariant={"subtle"}
							content={{ label: useProjectStageColors ? "Turn off" : "Turn on" }}
							disabled={isInFlight}
							onClick={() => {
								commit({
									variables: {
										input: {
											useStagesColorForProjectNames: !useProjectStageColors,
										},
									},
									onCompleted: () => {
										window.location.reload();
										onHide();
									},
									onError: () => {
										toast.error("An error occurred.");
									},
								});
							}}
						/>
					)}
				>
					{(onHide) => {
						return (
							<div>
								When turned on, this will mean the the project name on the project
								cards within the project view will have the same color as the
								project stage they are on.
								<br />
								If turned off, the color will be black.
							</div>
						);
					}}
				</DialogButton>
				<ImportProjectStagesButton />
				<ExportProjectStagesButton />
				{withoutEventPropagation(<CreateProjectStageButton connectionId={__id} />)}
				<DeleteProjectStagesButton
					regionIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not project stages yet.</div>
					</div>
				}
				className="mb-3"
				value={projectStages}
				selectionMode="multiple"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
				<Column
					header="Name"
					sortable
					sortField={"name"}
					body={(row: ProjectStagesTable_ProjectStageFragment$data) => {
						return row.name;
					}}
				/>
				<Column
					header="Project Sort Order in reports"
					sortable
					sortField={"reverseProjectOrderInReports"}
					body={(row: ProjectStagesTable_ProjectStageFragment$data) => {
						return row.reverseProjectOrderInReports ? "Reversed" : "Normal";
					}}
				/>
				<Column
					header="Sorting"
					sortable
					sortField={"sortOrder"}
					body={(row: ProjectStagesTable_ProjectStageFragment$data) => {
						return <ProjectStageSortOrderButtons projectStageFragmentRef={row} />;
					}}
				/>
				<Column
					header={"Color"}
					body={(row: ProjectStagesTable_ProjectStageFragment$data) => {
						return (
							<DefaultColorPickerComponent
								updateField={() => {}}
								fieldValue={row.color ?? DEFAULT_COLOR_PICKER_COLOR_WITH_HEX}
								disabled={true}
								tooltip={"Click edit to edit color."}
							/>
						);
					}}
				/>
				<Column
					header="Actions"
					body={(row: ProjectStagesTable_ProjectStageFragment$data) => {
						return (
							<div>
								<EditProjectStageButton className="mr-2" regionFragmentRef={row} />
							</div>
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
