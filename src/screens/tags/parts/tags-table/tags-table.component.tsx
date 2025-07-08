import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, useMutation, usePaginationFragment } from "react-relay";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { DefaultColorPickerComponent } from "@components/relay/default-color-picker";
import { TkDataTable } from "@components/ui/TkDataTable";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type tagsTable_Query } from "@relay/tagsTable_Query.graphql";
import { type tagsTable_QueryFragment$key } from "@relay/tagsTable_QueryFragment.graphql";
import { type tagsTable_Refetch } from "@relay/tagsTable_Refetch.graphql";
import { type tagsTable_SetTagsSortOrderMutation } from "@relay/tagsTable_SetTagsSortOrderMutation.graphql";
import { type tagsTable_TagInlineFragment$key } from "@relay/tagsTable_TagInlineFragment.graphql";

import { FiltersWrapper } from "@screens/assignment-roles/parts/assignment-roles-table/assignment-roles-table.styles";
import { CreateTagButton } from "@screens/tags/parts/create-tag-button";
import { DeleteTagButton } from "@screens/tags/parts/delete-tag-button";
import { EditTagButton } from "@screens/tags/parts/edit-tag-button/edit-tag-button.component";
import { ExportTagsButton } from "@screens/tags/parts/export-tags-button";
import { ImportTagsButton } from "@screens/tags/parts/import-tags-button";
import {
	tagsTableColumns,
	type TagsTableColumnsField,
} from "@screens/tags/parts/tags-table/tags-table.consts";
import { SettingsTagsContext } from "@screens/tags/tags.context";
import { withoutEventPropagation } from "@utils/table.utils";
import {
	QUERY,
	QUERY_FRAGMENT,
	SET_TAGS_SORT_ORDER_MUTATION,
	TAG_INLINE_FRAGMENT,
} from "./tags-table.graphql";

export const TagsTable = () => {
	const { name } = useContext(SettingsTagsContext);

	const [setSortOrder, isSettingSortOrder] = useMutation<tagsTable_SetTagsSortOrderMutation>(
		SET_TAGS_SORT_ORDER_MUTATION,
	);
	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<tagsTable_Query>(QUERY, { name });

	const {
		data: {
			Tag: {
				GetTagsByName: { __id, edges: tagEdges },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<tagsTable_Refetch, tagsTable_QueryFragment$key>(QUERY_FRAGMENT, data);

	const debouncedRefetch = (name: string) => {
		refetch({ name, first: 20 }, { fetchPolicy: "store-or-network" });
	};

	const debouncedEventHandler = useMemo(
		() => debounce(debouncedRefetch, 1000),
		// eslint-disable-next-line
		[name],
	);

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else {
			debouncedEventHandler(name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	const [selection, setSelection] = useState<Array<{ id: string }>>([]);

	const tags = (tagEdges ?? [])
		?.map((b) => b!.node!)
		?.map((e) => readInlineData<tagsTable_TagInlineFragment$key>(TAG_INLINE_FRAGMENT, e!))
		// TODO: double check necessity for this
		.sort((a, b) => (a.data.sortOrder > b.data.sortOrder ? 1 : -1));

	const dynamicColumns = tagsTableColumns.map((col) => {
		const basic = (
			<Column key={col.field} columnKey={col.field} field={col.field} header={col.header} />
		);
		return match<TagsTableColumnsField>(col.field)
			.with("data.name", () => basic)
			.with("data.sortOrder", () => basic)
			.with("data.color", () => (
				<Column
					key={col.field}
					header={col.header}
					columnKey={col.field}
					body={(row) => {
						return withoutEventPropagation(
							<div className="flex">
								<DefaultColorPickerComponent
									fieldValue={row.data.color}
									updateField={() => {}}
									disabled
									tooltip={"Click the edit button to change color"}
								/>
							</div>,
						);
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
								<EditTagButton tagFragmentRef={row} />
							</div>,
						);
					}}
				/>
			))
			.otherwise(() => <Fragment />);
	});
	const hasPermissions = useSelector(selectHasPermissions);
	const hasReorderPermission = hasPermissions(["UserInAccountPermission_Tag_AdminEdit"]);
	return (
		<>
			<FiltersWrapper className="flex justify-content-end gap-2">
				<ImportTagsButton />
				<ExportTagsButton />
				<CreateTagButton connections={[__id]} />
				<DeleteTagButton tagIds={selection.map((s) => s.id)} connectionIds={[__id]} />
			</FiltersWrapper>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no tags yet.</div>
					</div>
				}
				selectionMode="checkbox"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
				className="mb-3"
				value={tags as any[]}
				reorderableRows={!isSettingSortOrder || hasReorderPermission}
				onRowReorder={(e) => {
					const sourceIndex = e.dragIndex;
					const targetIndex = e.dropIndex;
					const sourceId = tags![sourceIndex].id;
					const targetId = tags![targetIndex].id;
					// TODO
					setSortOrder({
						variables: {
							input: {
								sourceId,
								targetId,
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
