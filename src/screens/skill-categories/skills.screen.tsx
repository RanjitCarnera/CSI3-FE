import { Suspense } from "react";
import { SkillCategoriesTable } from "@screens/skill-categories/parts/skills-categories-table";
import { SkillCategoryFilters } from "../../components/relay/SkillCategoryFilters";
import { SkillFilters } from "../../components/relay/SkillFilters";
import { SkillsTable } from "../../components/relay/SkillsTable";
import { BaseSettingsScreen } from "../../components/ui/BaseSettingsScreen";
import { TkCard } from "../../components/ui/TkCard";
import { TkTableSkeleton } from "../../components/ui/TkTableSkeleton";

export const SkillsScreen = () => {
	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Attributes & Categories</h1>
					</div>
				}
			>
				<h3>Attribute categories</h3>
				<div className="mb-3">
					<SkillCategoryFilters />
				</div>

				<Suspense fallback={<TkTableSkeleton columnNames={["Name", "Actions"]} />}>
					<SkillCategoriesTable />
				</Suspense>

				<h3 className="mt-5">Attributes</h3>

				<div className="mb-3">
					<SkillFilters />
				</div>

				<Suspense fallback={<TkTableSkeleton columnNames={["Name", "Actions"]} />}>
					<SkillsTable />
				</Suspense>
			</TkCard>
		</BaseSettingsScreen>
	);
};
