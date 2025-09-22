import { TabPanel, TabView } from "primereact/tabview";
import { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { ImportSouthwayButton } from "@components/import-southway-button";

import { CreatePersonButton } from "@components/relay/CreatePersonButton";
import { DeletePeopleButton } from "@components/relay/DeletePeopleButton";
import { ExportPeopleButton } from "@components/relay/ExportPeopleButton";
import { ImportPeoplesoftButton } from "@components/relay/import-peoplesoft-button";
import { ImportPeopleButton } from "@components/relay/ImportPeopleButton";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { Loader } from "@components/ui/Loader";
import { selectPeopleConnectionId, selectPeopleSelection } from "@redux/PeopleSlice";
import { PeopleTableWithQuery } from "@screens/people/parts/people-table-with-query/activated-people-table.component";
import { PeopleFiltersComponent } from "./parts/people-filters.component";

export const PeopleScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Resources"}
			Filters={PeopleFiltersComponent}
			Table={Table}
		/>
	);
};

const Table = () => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	return (
		<PeopleLayout>
			<TabView
				activeIndex={activeIndex}
				onTabChange={(e) => {
					setActiveIndex(e.index);
				}}
			>
				<TabPanel header="Activated resources">
					<Suspense fallback={<Loader />}>
						<PeopleTableWithQuery activationStatus={true} />
					</Suspense>
				</TabPanel>
				<TabPanel header="Deactivated resources">
					<Suspense fallback={<Loader />}>
						<PeopleTableWithQuery activationStatus={false} />
					</Suspense>
				</TabPanel>
			</TabView>
		</PeopleLayout>
	);
};

const PeopleLayout = ({ children }: React.PropsWithChildren) => {
	const selection = useSelector(selectPeopleSelection);
	const connectionId = useSelector(selectPeopleConnectionId);
	return (
		<div
			style={{
				gap: "0.5rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					gap: "0.5rem",
					display: "flex",
					flexDirection: "column",
					position: "sticky",
					top: "-10px",
					padding: "10px 0",
					zIndex: 100,
					backgroundColor: "white",
				}}
			>
				<div className="flex justify-content-end gap-2">
					<ImportPeopleButton />
					<ImportSouthwayButton peopleIds={selection.map((s) => s.id)} />
					<ImportPeoplesoftButton peopleIds={selection.map((s) => s.id)} />
					<ExportPeopleButton />
					<CreatePersonButton connectionId={connectionId} />
					<DeletePeopleButton
						peopleIds={selection.map((s) => s.id)}
						connectionIds={[connectionId]}
					/>
				</div>
			</div>
			{children}
		</div>
	);
};
