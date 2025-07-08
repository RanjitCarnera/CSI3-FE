import { Button } from "@thekeytechnology/framework-react-components";
import debounce from "lodash.debounce";
import { Button as PrButton } from "primereact/button";
import { Column } from "primereact/column";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import { TkDataTable } from "@components/ui/TkDataTable";
import {
	selectSkillAssessmentTemplatesFilters,
	type SkillAssessmentTemplatesFilters,
} from "@redux/skill-assessment-templates-slice";
import {
	type skillAssessmentTemplatesTable_AssessmentTemplateFragment$data,
	type skillAssessmentTemplatesTable_AssessmentTemplateFragment$key,
} from "@relay/skillAssessmentTemplatesTable_AssessmentTemplateFragment.graphql";
import { type skillAssessmentTemplatesTable_AssessmentTemplatesFragment$key } from "@relay/skillAssessmentTemplatesTable_AssessmentTemplatesFragment.graphql";
import { type skillAssessmentTemplatesTable_Query } from "@relay/skillAssessmentTemplatesTable_Query.graphql";
import { type skillAssessmentTemplatesTable_Refetch } from "@relay/skillAssessmentTemplatesTable_Refetch.graphql";
import { SKILL_ASSESSMENT_PATH_WITH_ID } from "@screens/skill-assessment/skill-assessment.consts";
import { CreateTemplateButton } from "@screens/skill-assessment-templates/parts/create-template-button";
import { CreateTemplateFormContext } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.context";
import {
	SkillAssessmentTemplatesTableProps,
} from "@screens/skill-assessment-templates/parts/skill-assessment-templates-table/skill-assessment-templates-table.types";
import {
	ASSESSMENT_TEMPLATE_FRAGMENT,
	QUERY,
	QUERY_FRAGMENT,
} from "@screens/skill-assessment-templates/skill-assessment-templates.graphql";

import { EditTemplateButton } from "@screens/skill-assessment-templates/parts/edit-template-button/edit-template-button.component";
import { DeleteAssessmentTemplatesButton } from "@screens/skill-assessment-templates/parts/delete-assessment-templates-button";
import { withoutEventPropagation } from "@utils/table.utils";
import { ActionWrapper } from "@screens/skill-assessment-templates/parts/skill-assessment-templates-table/skill-assessment-templates-table.styles";

export const SkillAssessmentTemplatesTable = ({ ...props }: SkillAssessmentTemplatesTableProps) => {
	const filters = useSelector(selectSkillAssessmentTemplatesFilters);
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const { setConnectionId } = useContext(CreateTemplateFormContext);
	const data = useLazyLoadQuery<skillAssessmentTemplatesTable_Query>(QUERY, {
		first: 250,
		...filters,
	});

	const {
		data: {
			Admin: {
				Assessment: {
					AssessmentTemplates: { __id, edges: assessmentTemplatesEdges },
				},
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<
		skillAssessmentTemplatesTable_Refetch,
		skillAssessmentTemplatesTable_AssessmentTemplatesFragment$key
	>(QUERY_FRAGMENT, data);

	const debouncedRefetch = (filters: SkillAssessmentTemplatesFilters) => {
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

	const assessmentTemplates = useMemo(
		() =>
			assessmentTemplatesEdges?.map((e) =>
				readInlineData<skillAssessmentTemplatesTable_AssessmentTemplateFragment$key>(
					ASSESSMENT_TEMPLATE_FRAGMENT,
					e!.node,
				),
			),
		[assessmentTemplatesEdges],
	);

	const navigate = useNavigate();

	const handleOnClick = () => {
		const accountId = data.Viewer.Auth.currentAccount?.id;
		if (!accountId) return;
		navigate(SKILL_ASSESSMENT_PATH_WITH_ID(accountId));
	};

	useEffect(() => {
		setConnectionId(__id);
	}, [__id]);
	return (
		<>
			<ActionWrapper>
				<CreateTemplateButton />
				<Button
					content={{
						label: "Landing page",
						icon: "pi pi-arrow-up-right",
					}}
					inputVariant={"solid"}
					onClick={handleOnClick}
				/>
				<DeleteAssessmentTemplatesButton
					assessmentTemplateIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</ActionWrapper>
			<TkDataTable
				selectionMode="multiple"
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no assessment templates yet.</div>
					</div>
				}
				className="mb-3"
				value={assessmentTemplates}
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>

				<Column
					header="Template Name"
					sortable
					sortField={"name"}
					body={(row: skillAssessmentTemplatesTable_AssessmentTemplateFragment$data) => {
						return row.name;
					}}
				/>

				<Column
					header="Actions"
					body={(row: skillAssessmentTemplatesTable_AssessmentTemplateFragment$data) => {
						return withoutEventPropagation(
							<EditTemplateButton assessmentTemplateFragmentRef={row} />,
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
