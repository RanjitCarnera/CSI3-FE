import { Button, InputText } from "@thekeytechnology/framework-react-components";
import React, { type PropsWithChildren } from "react";
import {
	HeaderWrapper,
	ResetWrapper,
	Wrapper,
} from "@components/settings-filters/settings-filters.styles";
import { type DefaultSettingsFiltersProps } from "@components/settings-filters/settings-filters.types";
import { placeholder } from "@screens/skill-assessments/parts/skill-assessments-filters/skill-assessments-filters.consts";

export const DefaultSettingsFilters = ({
	value,
	onChange: handleOnChange,
	onReset: handleOnReset,
	children,
}: PropsWithChildren<DefaultSettingsFiltersProps>) => {
	return (
		<Wrapper>
			<HeaderWrapper>
				<strong>Filters</strong>
			</HeaderWrapper>
			<InputText
				value={value ?? ""}
				onValueChange={handleOnChange}
				placeholder={placeholder}
				inputSize={"large"}
			/>
			{children}
			<ResetWrapper>
				<Button content={{ label: "Reset", icon: "pi pi-times" }} onClick={handleOnReset} />
			</ResetWrapper>
		</Wrapper>
	);
};
