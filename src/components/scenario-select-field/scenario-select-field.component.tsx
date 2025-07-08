import { Dropdown } from "primereact/dropdown";
import React, { Suspense, useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { type ScenarioSelectFieldProps } from "@components/scenario-select-field/scenario-select-field.types";
import { Loader } from "@components/ui/Loader";
import {
	type scenarioSelectField_Query,
	type scenarioSelectField_Query$variables,
} from "@relay/scenarioSelectField_Query.graphql";
import {
	type scenarioSelectField_ScenarioInlineFragment$data,
	type scenarioSelectField_ScenarioInlineFragment$key,
} from "@relay/scenarioSelectField_ScenarioInlineFragment.graphql";
import { QUERY, SCENARIO_INLINE_FRAGMENT } from "./scenario-select-field.graphql";

const ScenarioSelectFieldComponent = ({
	onlyMaster,
	onlyMine,
	...fieldConfig
}: ScenarioSelectFieldProps) => {
	const environment = useRelayEnvironment();
	const [scenarios, setScenarios] = useState<scenarioSelectField_ScenarioInlineFragment$data[]>(
		[],
	);
	const refetch = (variables: scenarioSelectField_Query$variables = {}) => {
		void fetchQuery<scenarioSelectField_Query>(environment, QUERY, variables)
			.toPromise()
			.then((res) => {
				const inlineScenarios =
					res?.Scenario?.Scenarios?.edges?.map((e) =>
						readInlineData<scenarioSelectField_ScenarioInlineFragment$key>(
							SCENARIO_INLINE_FRAGMENT,
							e!.node,
						),
					) ?? [];
				setScenarios(inlineScenarios);
			});
	};
	useEffect(() => {
		refetch();
	}, []);

	return (
		<Dropdown
			name={fieldConfig.fieldName}
			disabled={fieldConfig.disabled}
			value={fieldConfig.fieldValue}
			options={[
				...scenarios.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.id,
					};
				}),
			]}
			onChange={(e) => {
				console.time("onChange");
				fieldConfig.updateField(e.value);
				console.timeEnd("onChange");
			}}
			filter={true}
			placeholder={fieldConfig.placeholder}
			filterBy={"name"}
			onFilter={(e) => {
				refetch({
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					onlyMaster,
					onlyMine,
				});
			}}
		/>
	);
};

export const ScenarioSelectField = (props: ScenarioSelectFieldProps) => {
	return (
		<Suspense fallback={<Loader />}>
			<ScenarioSelectFieldComponent {...props} />
		</Suspense>
	);
};
