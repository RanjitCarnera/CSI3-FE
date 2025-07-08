import {Column} from "primereact/column";
import graphql from "babel-plugin-relay/macro";
import {useLazyLoadQuery, usePaginationFragment} from "react-relay";
import {TkDataTable} from "../ui/TkDataTable";
import {UsersTable_Query} from "../../__generated__/UsersTable_Query.graphql";
import {UsersTable_Refetch} from "../../__generated__/UsersTable_Refetch.graphql";
import {UsersTable_UsersListFragment$key} from "../../__generated__/UsersTable_UsersListFragment.graphql";
import {EditUserButton} from "./EditUserButton";
import {AnonymizeUserButton} from "./AnonymizeUserButton";
import {Button} from "primereact/button";

const QUERY = graphql`
    query UsersTable_Query($first: Int) {
        ...UsersTable_UsersListFragment @arguments(first: $first)

    }
`

const LIST_FRAGMENT = graphql`
    fragment UsersTable_UsersListFragment on Query @refetchable(queryName: "UsersTable_Refetch") @argumentDefinitions(
        first: {type: "Int", defaultValue: 20},
        after: {type: "String"},
    ){
        Admin {
            Management {
                UsersAdmin(first: $first, after: $after)  @connection(key: "UsersTable_UsersAdmin"){
                    __id
                    edges {
                        node {
                            id
                            name
                            email
                            activated
                            groupAssociations {
                                account {
                                    name
                                }
                                group {
                                    id
                                    name
                                }
                            }
                            ...EditUserButton_UserFragment
                            ...AnonymizeUserButton_UserFragment
                        }
                    }
                }
            }
        }
    }
`


export const UsersTable = () => {
    const data = useLazyLoadQuery<UsersTable_Query>(QUERY, {first: 20})

    const {
        hasNext,
        loadNext,
        data: {
            Admin: {Management: {UsersAdmin: {__id, edges: Users}}}
        },
    } = usePaginationFragment<UsersTable_Refetch, UsersTable_UsersListFragment$key>(LIST_FRAGMENT, data)


    return <>
        {Users?.length ? <div className="mb-5">
            <TkDataTable
                emptyMessage={<div className="flex justify-content-center align-items-center">
                    <div className="mr-2">There are no Users in the system yet yet.</div>
                </div>}
                className="mb-3"
                value={Users?.map(b => b!.node!) as any[]}
            >
                <Column header="Name" body={row => {
                    return row.name
                }}/>
                <Column header="E-Mail" body={row => {
                    return row.email
                }}/>
                <Column header="Activated" body={row => {
                    return row?.activated ? "Activated" : "Not activated"
                }}/>
                <Column header="Access" body={row => {
                    return row?.groupAssociations?.map((groupAssociation: any) => {
                        return <div key={groupAssociation.group?.id} className="flex">
                            <div className="mr-2 font-bold">{groupAssociation.account?.name}:</div>
                            <div>{groupAssociation.group?.name}</div>
                        </div>
                    })
                }}/>
                <Column header="Actions" body={row => {
                    return <div>
                        <EditUserButton className={"mr-2"} userFragmentRef={row}/>
                        <AnonymizeUserButton connectionId={__id} userFragmentRef={row}/>
                    </div>
                }}/>
            </TkDataTable>
            {hasNext && <div className="flex justify-content-center align-items-center">
                <Button
                    type="button"
                    className="p-button-secondary" disabled={!hasNext} onClick={() => loadNext(20)}>Load more</Button>
            </div>}
        </div> : null}

    </>
}


