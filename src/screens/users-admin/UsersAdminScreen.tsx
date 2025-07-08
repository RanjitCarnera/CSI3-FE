import {BaseSettingsScreen} from "../../components/ui/BaseSettingsScreen";
import {TkCard} from "../../components/ui/TkCard";
import {Suspense} from "react";
import {TkTableSkeleton} from "../../components/ui/TkTableSkeleton";
import {UsersTable} from "../../components/relay/UsersTable";

export const UsersAdminScreen = () => {
    return <BaseSettingsScreen>
        <TkCard header={<div className="flex p-3 align-items-center card-flat">
            <h1 className="mt-0 mr-3 mb-0 ml-0">Users (Admin View)</h1>
        </div>
        }>
            <Suspense fallback={<TkTableSkeleton columnNames={["Name", "Registered at", "Actions"]}/>}>
                <UsersTable/>
            </Suspense>
        </TkCard>
    </BaseSettingsScreen>

}
