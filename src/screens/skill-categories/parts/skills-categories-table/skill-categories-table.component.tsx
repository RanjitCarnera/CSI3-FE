import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";

import { CreateSkillCategoryButton } from "@components/create-skill-category-button";
import { DeleteSkillCategoriesButton } from "@components/delete-skill-categories-button";
import { EditSkillCategoryButton } from "@components/edit-skill-category-button";
import { ExportSkillCategoriesButton } from "@components/export-skill-categories-button";
import { ImportSkillCategoriesButton } from "@components/import-skill-categories-button";
import { SkillCategorySortOrderButtons } from "@components/relay/SkillCategorySortOrderButtons";
import { TkDataTable } from "@components/ui/TkDataTable";
import { selectSkillCategoryFilters, type SkillCategoryFilters } from "@redux/SkillCategroySlice";
import { type skillCategoriesTable_Query } from "@relay/skillCategoriesTable_Query.graphql";
import { type skillCategoriesTable_QueryFragment$key } from "@relay/skillCategoriesTable_QueryFragment.graphql";
import { type skillCategoriesTable_Refetch } from "@relay/skillCategoriesTable_Refetch.graphql";
import {
	QUERY,
	QUERY_FRAGMENT,
} from "@screens/skill-categories/parts/skills-categories-table/skill-categories-table.graphql";

export const SkillCategoriesTable = () => {
	const filters = useSelector(selectSkillCategoryFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<skillCategoriesTable_Query>(QUERY, { first: 20, ...filters });

	const {
		data: {
			Skills: {
				SkillCategories: { __id, edges: skillCategories },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<skillCategoriesTable_Refetch, skillCategoriesTable_QueryFragment$key>(
		QUERY_FRAGMENT,
		data,
	);

	const debouncedRefetch = (filters: SkillCategoryFilters) => {
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

	return (
		<>
			<div className="flex justify-content-end gap-2">
				<ImportSkillCategoriesButton />
				<ExportSkillCategoriesButton />
				<CreateSkillCategoryButton connectionId={__id} />
				<DeleteSkillCategoriesButton
					skillCategoryIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no attribute categories yet.</div>
					</div>
				}
				className="mb-3"
				value={
					skillCategories
						?.map((b) => b!.node!)
						.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1)) as any[]
				}
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
					body={(row) => {
						return row.name;
					}}
				/>
				<Column
					header="Sorting"
					sortable
					sortField={"sortOrder"}
					body={(row) => {
						return <SkillCategorySortOrderButtons skillCategoryFragmentRef={row} />;
					}}
				/>
				<Column
					header="Actions"
					body={(row) => {
						return (
							<div>
								<EditSkillCategoryButton skillCategoryFragmentRef={row} />
							</div>
						);
					}}
				/>
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
