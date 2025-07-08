import {Column} from "primereact/column";
import graphql from "babel-plugin-relay/macro";
import {useLazyLoadQuery, usePaginationFragment} from "react-relay";
import {TkDataTable} from "../ui/TkDataTable";
import {InviteUserToAccountButton} from "./InviteUserToAccountButton";
import {DeleteInvitationButton} from "./DeleteInvitationButton";
import {InvitationsTable_Query} from "../../__generated__/InvitationsTable_Query.graphql";
import {InvitationsTable_Refetch} from "../../__generated__/InvitationsTable_Refetch.graphql";
import {
    InvitationsTable_InvitationsListFragment$key
} from "../../__generated__/InvitationsTable_InvitationsListFragment.graphql";
import {Button} from "primereact/button";

const QUERY = graphql`
    query InvitationsTable_Query($first: Int) {
        ...InvitationsTable_InvitationsListFragment @arguments(first: $first)

    }
`


const LIST_FRAGMENT = graphql`
    fragment InvitationsTable_InvitationsListFragment on Query @refetchable(queryName: "InvitationsTable_Refetch") @argumentDefinitions(
        first: {type: "Int", defaultValue: 20},
        after: {type: "String"},
    ){
        Management {
            InvitationsToAccount(first: $first, after: $after)  @connection(key: "InvitationsTable_InvitationsToAccount"){
                __id
                edges {
                    node {
                        id
                        email
                        invitingUserName
                    }
                }
            }
        }
    }
`


export const InvitationsTable = () => {
    const data = useLazyLoadQuery<InvitationsTable_Query>(QUERY, {first: 20})

    const {
        hasNext,
        loadNext,
        data: {
            Management: {InvitationsToAccount: {__id, edges: invitations}}
        },
    } = usePaginationFragment<InvitationsTable_Refetch, InvitationsTable_InvitationsListFragment$key>(LIST_FRAGMENT, data)


    return <>
        <div className="flex justify-content-end">
            <InviteUserToAccountButton connectionId={__id}/>
        </div>
        {invitations?.length ? <div className="mb-5">
            <h3>Invitations</h3>
            <TkDataTable
                emptyMessage={<div className="flex justify-content-center align-items-center">
                    <div className="mr-2">There are no invitations to your account yet.</div>
                </div>}
                className="mb-3"
                value={invitations?.map(b => b!.node!) as any[]}
            >
                <Column header="Invited by" body={row => {
                    return row.invitingUserName
                }}/>
                <Column header="Email" body={row => {
                    return row.email
                }}/>
                <Column
                    header="Actions"
                    body={row => {
                        return <div>
                            <DeleteInvitationButton invitationId={row.id} connectionId={__id}/>
                        </div>
                    }}
                />
            </TkDataTable>
        </div> : null}
        {hasNext && <div className="flex justify-content-center align-items-center">
            <Button
                type="button"
                className="p-button-secondary" disabled={!hasNext} onClick={() => loadNext(20)}>Load more</Button>
        </div>}
    </>
}


