import React from "react";

export type SettingsScreenTemplateProps = {
	title: string;
	Filters: React.FC;
	Table: React.FC;
	ContextProvider?: (p: React.PropsWithChildren) => React.ReactElement;
	tableSkeletonColumnNames?: string[];
};
