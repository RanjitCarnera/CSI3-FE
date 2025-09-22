import { TabPanel, TabView } from "primereact/tabview";
import { Fragment, Suspense, useState } from "react";
import { ProjectsTable } from "@components/relay/ProjectsTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { Loader } from "@components/ui/Loader";
import { DeactivatedProjectsTable } from "@screens/projects/parts/deactivated-projects-table/deactivated-projects-table.component";
import { ProjectsLayout } from "@screens/projects/parts/projects-layout";

export const ProjectsScreen = () => {
	return <SettingsScreenTemplate title={"Projects"} Filters={Fragment} Table={Table} />;
};

const Table = () => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	return (
		<ProjectsLayout>
			<TabView
				activeIndex={activeIndex}
				onTabChange={(e) => {
					setActiveIndex(e.index);
				}}
			>
				<TabPanel header="Activated projects">
					<Suspense fallback={<Loader />}>
						<ProjectsTable />
					</Suspense>
				</TabPanel>
				<TabPanel header="Deactivated projects">
					<Suspense fallback={<Loader />}>
						<DeactivatedProjectsTable />
					</Suspense>
				</TabPanel>
			</TabView>
		</ProjectsLayout>
	);
};
