import { InputSwitch } from "primereact/inputswitch";
import React, { type ReactNode } from "react";
import { match } from "ts-pattern";
import { type EditProjectFormState } from "@components/ui/edit-project-form";
import { ValidatedField, type ValidatedFieldPropsV2 } from "./ValidatedField";

interface OwnProps<State, FieldType> extends ValidatedFieldPropsV2<State, FieldType> {
	comparisonState?: State;
	enableComparison: boolean;
	selectedKeys: Array<keyof State & string>;
	setSelectedKeys: (selectedKeys: Array<keyof State & string>) => void;
	comparisonComponent: (value: FieldType | undefined) => ReactNode;
}

export function ValidatedFieldWithComparison<State extends EditProjectFormState, FieldType>({
	comparisonState,
	enableComparison,
	selectedKeys,
	setSelectedKeys,
	comparisonComponent,
	...rest
}: OwnProps<State, FieldType>) {
	const comparisonValue = comparisonState
		? (comparisonState[rest.name] as unknown as FieldType)
		: undefined;
	const fromExtension = match(comparisonState?.source)
		.returnType<string>()
		.with("fromDynamics", () => "Dynamics")
		.with("fromDynamicsActivity", () => "Dynamics")
		.with("fromRand", () => "Rand")
		.with("manuallyCreated", () => "TeamBuilder")
		.otherwise(() => "");

	return (
		<div className={enableComparison ? "mb-5" : ""}>
			<ValidatedField {...rest} className={enableComparison ? "" : rest.className} />
			{enableComparison && (
				<div className="flex align-items-center">
					<InputSwitch
						className="mr-2"
						checked={selectedKeys.includes(rest.name)}
						onChange={(e) => {
							if (e.value) {
								setSelectedKeys([...selectedKeys, rest.name]);
							} else {
								setSelectedKeys(selectedKeys.filter((s) => s !== rest.name));
							}
						}}
					/>
					<span className="mr-2">Overwrite with</span>
					<strong>
						{comparisonValue ? comparisonComponent(comparisonValue) : "NO VALUE"}
					</strong>
					<span className="ml-2">from {fromExtension}</span>
				</div>
			)}
		</div>
	);
}
