import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery, useMutation, usePaginationFragment } from "react-relay";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { CreateAssignmentRoleButton } from "@components/create-assignment-role-button";
import { DeleteAssignmentRolesButton } from "@components/delete-assignment-roles-button";
import { EditAssignmentRoleButton } from "@components/edit-assignment-role-button";
import { ExportAssignmentRolesButton } from "@components/export-assignment-roles-button";
import { ImportAssignmentRolesButton } from "@components/import-assignment-roles-button";
import { TkDataTable } from "@components/ui/TkDataTable";
import {
	type AssignmentRolesFilters,
	selectAssignmentRolesFilters,
} from "@redux/AssignmentRoleSlice";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type assignmentRolesTable_AssignmentRolesQueryFragment$key } from "@relay/assignmentRolesTable_AssignmentRolesQueryFragment.graphql";
import { type assignmentRolesTable_Query } from "@relay/assignmentRolesTable_Query.graphql";
import { type assignmentRolesTable_Refetch } from "@relay/assignmentRolesTable_Refetch.graphql";
import { type assignmentRolesTable_SetAssignmentRoleSortOrderMutation } from "@relay/assignmentRolesTable_SetAssignmentRoleSortOrderMutation.graphql";
import {
	type ColumnField,
	columns,
} from "@screens/assignment-roles/parts/assignment-roles-table/assignment-roles-table.consts";
import {
	QUERY,
	QUERY_FRAGMENT,
	SET_ASSIGNMENT_ROLE_SORT_ORDERS,
} from "@screens/assignment-roles/parts/assignment-roles-table/assignment-roles-table.graphql";
import { FiltersWrapper } from "@screens/assignment-roles/parts/assignment-roles-table/assignment-roles-table.styles";
import { withoutEventPropagation } from "@utils/table.utils";

export const AssignmentAssignmentRolesTable = () => {
	const filters = useSelector(selectAssignmentRolesFilters);

	const [set, isSetting] = useMutation<assignmentRolesTable_SetAssignmentRoleSortOrderMutation>(
		SET_ASSIGNMENT_ROLE_SORT_ORDERS,
	);
	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<assignmentRolesTable_Query>(QUERY, { first: 20, ...filters });

	const {
		data: {
			Assignments: {
				AssignmentRoles: { __id, edges: assignmentRoleEdges },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<
		assignmentRolesTable_Refetch,
		assignmentRolesTable_AssignmentRolesQueryFragment$key
	>(QUERY_FRAGMENT, data);

	const debouncedRefetch = (filters: AssignmentRolesFilters) => {
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

	const assignmentRoles = assignmentRoleEdges
		?.map((b) => b!.node!)
		.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1));

	const dynamicColumns = columns.map((col) => {
		const basic = (
			<Column key={col.field} columnKey={col.field} field={col.field} header={col.header} />
		);
		return match<ColumnField>(col.field)
			.with("name", () => basic)
			.with("sortOrder", () => basic)
			.with("maxNumberOfProjects", () => basic)
			.with("utilizationProjectionCapInMonths", () => (
				<Column
					key={col.field}
					columnKey={col.field}
					header={col.header}
					sortable
					sortField={col.field}
					body={(row) =>
						row.utilizationProjectionCapInMonths
							? row.utilizationProjectionCapInMonths + " months"
							: "Last assignment end"
					}
				/>
			))
			.with("countAsFullyAllocatedAtPercentage", () => (
				<Column
					key={col.field}
					columnKey={col.field}
					header={col.header}
					sortable
					sortField={col.field}
					body={(row) => {
						return row.countAsFullyAllocatedAtPercentage
							? (row.countAsFullyAllocatedAtPercentage * 100).toFixed(0) + "%"
							: "75%";
					}}
				/>
			))
			.with("countAsOverallocatedAtPercentage", () => (
				<Column
					key={col.field}
					columnKey={col.field}
					header={col.header}
					sortable
					sortField={col.field}
					body={(row) => {
						return row.countAsOverallocatedAtPercentage
							? (row.countAsOverallocatedAtPercentage * 100).toFixed(0) + "%"
							: "125%";
					}}
				/>
			))
			.with("actions", () => (
				<Column
					key={col.field}
					header={col.header}
					columnKey={col.field}
					body={(row) => {
						return withoutEventPropagation(
							<div className="flex">
								<EditAssignmentRoleButton assignmentRoleFragmentRef={row} />
							</div>,
						);
					}}
				/>
			))
			.otherwise(() => <Fragment />);
	});
	const hasPermissions = useSelector(selectHasPermissions);
	const hasReorderPermission = hasPermissions(["UserInAccountPermission_AssignmentRole_Edit"]);
	return (
		<>
			<FiltersWrapper className="flex justify-content-end gap-2">
				<ImportAssignmentRolesButton />
				<ExportAssignmentRolesButton />
				<CreateAssignmentRoleButton connectionId={__id} />
				<DeleteAssignmentRolesButton
					assignmentRoleIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</FiltersWrapper>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not assignment roles yet.</div>
					</div>
				}
				selectionMode="multiple"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
				className="mb-3"
				value={assignmentRoles as any[]}
				reorderableRows={!isSetting || hasReorderPermission}
				onRowReorder={(e) => {
					set({
						variables: {
							input: {
								assignmentRoleIds: e.value.map((e) => e.id),
							},
						},
						onCompleted: () => {
							setSelection([]);
							toast.success("Sort Orders Updated.");
						},
					});
				}}
			>
				<Column
					reorderable={hasReorderPermission}
					rowReorder={hasReorderPermission}
					rowReorderIcon={"pi pi-bars"}
				/>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
				{dynamicColumns}
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
