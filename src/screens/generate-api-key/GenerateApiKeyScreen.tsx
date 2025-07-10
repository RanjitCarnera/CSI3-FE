import { BaseSettingsScreen } from "@components/ui/BaseSettingsScreen";
import { TkCard } from "@components/ui/TkCard";
import { Suspense, useState } from "react";
import { TkTableSkeleton } from "@components/ui/TkTableSkeleton";
import { UserInAccountGroupsTable } from "@components/relay/user-in-account-groups-table/user-in-account-groups-table.component";
import { GenerateApiSection} from "./parts/GenerateApiSection";
import { UserApiKeySecretTable } from "./parts/UserApiKeySecretTable.component";

export const GenerateApiKeyScreen = () => {
    const [refetchTrigger, setRefetchTrigger] = useState(true);

    return (
        <BaseSettingsScreen>
            <TkCard
                header={
                    <div className="flex p-3 align-items-center card-flat">
                        <h1 className="mt-0 mr-3 mb-0 ml-0">Generate API Key & Secret</h1>
                    </div>
                }
            >
                <Suspense fallback={<TkTableSkeleton columnNames={["Name", "Actions"]} />}>
                    <GenerateApiSection triggerRefetch={setRefetchTrigger}/>
                    <UserApiKeySecretTable refetchTrigger={refetchTrigger} triggerRefetch={setRefetchTrigger} />
                </Suspense>
            </TkCard>
        </BaseSettingsScreen>
    );
};
