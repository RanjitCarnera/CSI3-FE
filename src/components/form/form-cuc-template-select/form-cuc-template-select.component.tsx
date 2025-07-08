import { Tooltip } from "@thekeytechnology/framework-react-components";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import styled from "styled-components";
import { Conditional } from "@components/conditional";
import {
	BACKGROUND_COLOR,
	baseOptions,
	BORDER_COLOR,
} from "@components/cuc-field/cuc-field.consts";
import { convertCUCToMarkerInputs } from "@components/cuc-field/cuc-field.utils";
import { createInitialData } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.utils";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import {
	type formCucTemplateSelect_CucTemplateInlineFragment$data,
	type formCucTemplateSelect_CucTemplateInlineFragment$key,
} from "@relay/formCucTemplateSelect_CucTemplateInlineFragment.graphql";
import { type formCucTemplateSelect_Query } from "@relay/formCucTemplateSelect_Query.graphql";
import { CUC_TEMPLATE_INLINE_FRAGMENT, QUERY } from "./form-cuc-template-select.graphql";
import { CUC_INLINE_FRAGMENT } from "@components/relay/EditAssignmentButton";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";

export const FormCucTemplateSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
	const environment = useRelayEnvironment();
	const op = useRef<OverlayPanel | null>(null);
	const [data, setData] = useState<formCucTemplateSelect_CucTemplateInlineFragment$data[]>([]);

	useEffect(() => {
		fetch();
		// eslint-disable-next-line
	}, []);

	const fetch = (name?: string) => {
		void fetchQuery<formCucTemplateSelect_Query>(
			environment,
			QUERY,
			{
				first: 20,
				filterByName: name ?? "",
				alwaysIncludeId: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : null,
			},
			{ fetchPolicy: "network-only" },
		)
			.toPromise()
			.then((res) => {
				const nodes = res?.CucTemplate.CucTemplates.edges?.map((e) => e?.node!) ?? [];
				const newData = nodes.map((node) =>
					readInlineData<formCucTemplateSelect_CucTemplateInlineFragment$key>(
						CUC_TEMPLATE_INLINE_FRAGMENT,
						node,
					),
				);
				setData(newData);
			});
	};

	const selection: formCucTemplateSelect_CucTemplateInlineFragment$data | undefined = useMemo(
		() => data.find((e) => e.id === fieldConfig.fieldValue),
		[fieldConfig.fieldValue, data],
	);

	return (
		<div className={"flex flex-column gap-2"}>
			<div className="p-inputgroup flex-1">
				<Conditional.Root condition={!!selection}>
					<Conditional.Success>
						<Tooltip target={"#previewTrigger"} content={<span>Preview CUC</span>} />
					</Conditional.Success>
				</Conditional.Root>
				<Button
					id={"previewTrigger"}
					onClick={(e) => {
						op.current?.toggle(e);
					}}
					disabled={!selection}
					type={"button"}
				>
					<i className="pi pi-search-plus" />
				</Button>

				<Dropdown
					className="dropdownWithTooltip"
					name={fieldConfig.fieldName}
					value={fieldConfig.fieldValue}
					disabled={fieldConfig.disabled}
					options={[
						...data.map((p) => {
							return {
								label: p.name,
								value: p.id,
							};
						}),
						{ label: "None", value: null },
					]}
					onChange={(e) => {
						fieldConfig.updateField(e.value);
					}}
					onFocus={(e) => {
						op.current?.hide();
					}}
					filter={true}
					placeholder={fieldConfig.placeholder}
					filterBy={"label"}
					onFilter={(e) => {
						fetch(e?.filter ?? "");
					}}
				/>
			</div>
			<MyOverlayPanel ref={op} dismissable={true}>
				{selection && (
					<div style={{ width: "200px", height: "150px" }}>
						<Line
							options={{
								...baseOptions,
								plugins: { title: {} },
								scales: {
									x: {
										dragData: false,
										type: "linear",
										suggestedMin: 0,
										suggestedMax: 100,
									},
									y: {
										dragData: false,
										suggestedMax: 150,
										beginAtZero: true,
									},
								},
							}}
							data={createInitialData(
								selection.name,
								convertCUCToMarkerInputs(
									readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
										CUC_INLINE_FRAGMENT,
										selection.cuc,
									),
								) ?? [],
								BORDER_COLOR,
								BACKGROUND_COLOR,
							)}
						/>
					</div>
				)}
			</MyOverlayPanel>
		</div>
	);
};

const MyOverlayPanel = styled(OverlayPanel)`
	&.p-overlaypanel.p-component {
		z-index: 1150 !important;
	}
`;
