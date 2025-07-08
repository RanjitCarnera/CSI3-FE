import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { convertCUCToMarkerInputs } from "@components/cuc-field/cuc-field.utils";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import { SettingsScreenTemplateHeader } from "@components/settings-screen-template/settings-screen-template.component";
import { TkDataTable } from "@components/ui/TkDataTable";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { selectCucTemplateFilters } from "@redux/cuc-templates.slice";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	type cucTemplatesTable_CucTemplateInlineFragment$data,
	type cucTemplatesTable_CucTemplateInlineFragment$key,
} from "@relay/cucTemplatesTable_CucTemplateInlineFragment.graphql";
import { type cucTemplatesTable_Query } from "@relay/cucTemplatesTable_Query.graphql";
import { type cucTemplatesTable_Refetch } from "@relay/cucTemplatesTable_Refetch.graphql";
import { type cucTemplatesTable_RefetchableQueryFragment$key } from "@relay/cucTemplatesTable_RefetchableQueryFragment.graphql";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { FiltersWrapper } from "@screens/assignment-roles/parts/assignment-roles-table/assignment-roles-table.styles";
import { CucPreview } from "@screens/cuc-templates/parts/cuc-preview";
import { DeleteCucTemplatesButton } from "@screens/cuc-templates/parts/delete-cuc-templates-button";
import { EditCucTemplateButton } from "@screens/cuc-templates/parts/edit-cuc-template-button";
import { CucTemplateTableFilters } from "@screens/cuc-templates/parts/table-filters";
import { emptyMessage } from "@screens/milestone-templates/parts/table/milestone-templates-table.consts";
import { withoutEventPropagation } from "@utils/table.utils";
import {
	CUC_TEMPLATE_INLINE_FRAGMENT,
	QUERY,
	REFETCHABLE_QUERY_FRAGMENT,
} from "./cuc-templates-table.graphql";
import { type CucTemplateFilters, type CucTemplateTableProps } from "./cuc-templates-table.types";
import { CreateCucTemplateButton } from "../create-cuc-template-button";

const Base = ({ queryFragmentRef }: CucTemplateTableProps) => {
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);
	const filters = useSelector(selectCucTemplateFilters);

	const debouncedRefetch = (filters: CucTemplateFilters) => {
		refetch(
			{ ...filters, first: 20, name: filters.filterByName },
			{ fetchPolicy: "network-only" },
		);
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
			CucTemplate: {
				CucTemplates: { edges, __id },
			},
		},
		refetch,
		hasNext,
		loadNext,
	} = usePaginationFragment<
		cucTemplatesTable_Refetch,
		cucTemplatesTable_RefetchableQueryFragment$key
	>(REFETCHABLE_QUERY_FRAGMENT, queryFragmentRef);

	const nodes = useMemo(
		() =>
			edges?.map((edge) =>
				readInlineData<cucTemplatesTable_CucTemplateInlineFragment$key>(
					CUC_TEMPLATE_INLINE_FRAGMENT,
					edge!.node,
				),
			) ?? [],
		[edges],
	);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasReadPermission = hasPermissions(["UserInAccountPermission_AssignmentRole_Edit"]);

	const handleClearSelection = () => {
		setSelection([]);
	};

	if (!hasReadPermission) return <Fragment />;
	return (
		<>
			<FiltersWrapper className="flex justify-content-end gap-2">
				<CreateCucTemplateButton connectionId={__id} />
				<DeleteCucTemplatesButton
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
					key={"name"}
					columnKey={"name"}
					header={"Name"}
					sortable
					sortField={"name"}
					body={(row: cucTemplatesTable_CucTemplateInlineFragment$data) => {
						return row.name;
					}}
				/>
				<Column
					key={"cuc"}
					columnKey={"cuc"}
					header={"CUC"}
					body={(row: cucTemplatesTable_CucTemplateInlineFragment$data) => {
						const cuc = readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
							CUC_INLINE_FRAGMENT,
							row.cuc,
						);
						return <CucPreview cuc={convertCUCToMarkerInputs(cuc) ?? []} />;
					}}
				/>
				<Column
					header={"Actions"}
					body={(row: cucTemplatesTable_CucTemplateInlineFragment$data) => {
						return withoutEventPropagation(
							<EditCucTemplateButton cucTemplateFragmentRef={row} />,
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

export const CucTemplatesTable = () => {
	const query = useLazyLoadQuery<cucTemplatesTable_Query>(
		QUERY,
		{},
		{ fetchPolicy: "store-and-network" },
	);
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<WithFeatureToggle featureId={"CUC"}>
				<SettingsScreenTemplateHeader>Cuc Templates</SettingsScreenTemplateHeader>
				<div className={"mb-3"}>
					<CucTemplateTableFilters />
				</div>
				<Base queryFragmentRef={query} />
			</WithFeatureToggle>
		</Suspense>
	);
};
