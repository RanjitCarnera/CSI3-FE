import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { SettingsScreenTemplateHeader } from "@components/settings-screen-template/settings-screen-template.component";
import { TkDataTable } from "@components/ui/TkDataTable";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	type MilestoneTemplateFilters,
	selectMilestoneTemplateFilters,
} from "@redux/milestone-template.slice";
import {
	type milestoneTemplatesTable_MilestoneTemplateInlineFragment$data,
	type milestoneTemplatesTable_MilestoneTemplateInlineFragment$key,
} from "@relay/milestoneTemplatesTable_MilestoneTemplateInlineFragment.graphql";
import { type milestoneTemplatesTable_Query } from "@relay/milestoneTemplatesTable_Query.graphql";
import { type milestoneTemplatesTable_Refetch } from "@relay/milestoneTemplatesTable_Refetch.graphql";
import { type milestoneTemplatesTable_RefetchableQueryFragment$key } from "@relay/milestoneTemplatesTable_RefetchableQueryFragment.graphql";
import { FiltersWrapper } from "@screens/assignment-roles/parts/assignment-roles-table/assignment-roles-table.styles";
import { CreateMilestoneTemplateButton } from "@screens/milestone-templates/parts/create-milestone-template-button";
import { DeleteMilestoneTemplatesButton } from "@screens/milestone-templates/parts/delete-milestone-templates-button";
import { EditMilestoneTemplateDataButton } from "@screens/milestone-templates/parts/edit-milestone-template-data-button";
import { type MilestoneTemplateTableProps } from "@screens/milestone-templates/parts/table/milestone-template-table.types";
import { emptyMessage } from "@screens/milestone-templates/parts/table/milestone-templates-table.consts";
import {
	MILESTONE_TEMPLATE_INLINE_FRAGMENT,
	QUERY,
	REFETCHABLE_QUERY_FRAGMENT,
} from "@screens/milestone-templates/parts/table/milestone-templates-table.graphql";
import { MilestoneTemplateTableFilters } from "@screens/milestone-templates/parts/table-filters";

const Base = ({ queryFragmentRef }: MilestoneTemplateTableProps) => {
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);
	const filters = useSelector(selectMilestoneTemplateFilters);

	const debouncedRefetch = (filters: MilestoneTemplateFilters) => {
		refetch({ ...filters, first: 20 }, { fetchPolicy: "network-only" });
	};

	const debouncedEventHandler = useMemo(
		() => debounce(debouncedRefetch, 500),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	useEffect(() => {
		debouncedEventHandler(filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	const {
		data: {
			MilestoneTemplate: {
				MilestoneTemplate: { edges, __id },
			},
		},
		refetch,
		hasNext,
		loadNext,
	} = usePaginationFragment<
		milestoneTemplatesTable_Refetch,
		milestoneTemplatesTable_RefetchableQueryFragment$key
	>(REFETCHABLE_QUERY_FRAGMENT, queryFragmentRef);

	const nodes = useMemo(
		() =>
			edges?.map((edge) =>
				readInlineData<milestoneTemplatesTable_MilestoneTemplateInlineFragment$key>(
					MILESTONE_TEMPLATE_INLINE_FRAGMENT,
					edge!.node,
				),
			) ?? [],
		[edges],
	);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasReadPermission = hasPermissions(["UserInAccountPermission_MilestoneTemplate_Read"]);

	const handleClearSelection = () => {
		setSelection([]);
	};

	if (!hasReadPermission) return <Fragment />;
	return (
		<>
			<FiltersWrapper className="flex justify-content-end gap-2">
				<CreateMilestoneTemplateButton connectionId={__id} />
				<DeleteMilestoneTemplatesButton
					connectionId={__id}
					ids={selection.map((e) => e.id)}
					onSuccess={handleClearSelection}
				/>
			</FiltersWrapper>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">{emptyMessage}</div>
					</div>
				}
				selectionMode="multiple"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
				className="mb-3"
				value={nodes}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
				<Column
					key={"data.name"}
					columnKey={"data.name"}
					header={"Name"}
					sortable
					sortField={"data.name"}
					body={(row: milestoneTemplatesTable_MilestoneTemplateInlineFragment$data) => {
						return row.data.name;
					}}
				/>
				<Column
					key={"data.timeInPercent"}
					columnKey={"data.timeInPercent"}
					header={"Time in %"}
					sortable
					sortField={"data.timeInPercent"}
					body={(row: milestoneTemplatesTable_MilestoneTemplateInlineFragment$data) => {
						return (row.data.timeInPercent * 100).toFixed(2);
					}}
				/>
				<Column
					header={"Actions"}
					body={(row: milestoneTemplatesTable_MilestoneTemplateInlineFragment$data) => {
						return (
							<EditMilestoneTemplateDataButton milestoneTemplateFragmentRef={row} />
						);
					}}
				></Column>
			</TkDataTable>
			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<Button
						type="button"
						className="p-button-secondary"
						disabled={!hasNext}
						onClick={() => loadNext(20)}
					>
						Load more
					</Button>
				</div>
			)}
		</>
	);
};

export const MilestoneTemplateTable = () => {
	const query = useLazyLoadQuery<milestoneTemplatesTable_Query>(
		QUERY,
		{},
		{ fetchPolicy: "store-and-network" },
	);
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<WithFeatureToggle featureId={"CUC"}>
				<SettingsScreenTemplateHeader>Milestone Templates</SettingsScreenTemplateHeader>
				<div className={"mb-3"}>
					<MilestoneTemplateTableFilters />
				</div>
				<Base queryFragmentRef={query} />
			</WithFeatureToggle>
		</Suspense>
	);
};
