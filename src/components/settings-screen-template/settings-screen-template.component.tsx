import React, { type PropsWithChildren, Suspense } from "react";
import {
	FiltersWrapper,
	HeaderSpan,
	HeaderWrapper,
} from "@components/settings-screen-template/settings-screen-template.styles";
import { type SettingsScreenTemplateProps } from "@components/settings-screen-template/settings-screen-template.types";
import { BaseSettingsScreen } from "@components/ui/BaseSettingsScreen";
import { TkCard } from "@components/ui/TkCard";
import { TkTableSkeleton } from "@components/ui/TkTableSkeleton";

export const SettingsScreenTemplate = ({
	title,
	Filters,
	Table,
	ContextProvider,
	tableSkeletonColumnNames = ["Name", "Actions"],
}: SettingsScreenTemplateProps) => {
	const base = (
		<BaseSettingsScreen>
			<TkCard header={<SettingsScreenTemplateHeader>{title}</SettingsScreenTemplateHeader>}>
				<FiltersWrapper className="mb-3">
					<Filters />
				</FiltersWrapper>

				<Suspense fallback={<TkTableSkeleton columnNames={tableSkeletonColumnNames} />}>
					<Table />
				</Suspense>
			</TkCard>
		</BaseSettingsScreen>
	);
	if (ContextProvider) return <ContextProvider>{base}</ContextProvider>;
	return base;
};

export const SettingsScreenTemplateHeader = ({ children }: PropsWithChildren) => {
	return (
		<HeaderWrapper className="flex p-3 align-items-center card-flat">
			<HeaderSpan className="mt-0 mr-3 mb-0 ml-0">{children}</HeaderSpan>
		</HeaderWrapper>
	);
};
