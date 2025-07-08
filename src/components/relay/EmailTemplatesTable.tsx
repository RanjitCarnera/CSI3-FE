import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import graphql from "babel-plugin-relay/macro";
import {ConnectionHandler, useMutation, usePaginationFragment} from "react-relay";
import {useNavigate} from "react-router-dom";
import {NewEmailTemplateButton} from "./NewEmailTemplateButton";
import {
    EmailTemplatesTable_EmailTemplatesListFragment$key
} from "../../__generated__/EmailTemplatesTable_EmailTemplatesListFragment.graphql";
import {EmailTemplatesTable_Refetch} from "../../__generated__/EmailTemplatesTable_Refetch.graphql";
import {EmailTemplatesTable_DeleteMutation} from "../../__generated__/EmailTemplatesTable_DeleteMutation.graphql";
import {useDialogLogic} from "../ui/useDialogLogic";
import {EDIT_EMAIL_TEMPLATE_PATH} from "../../screens/edit-email-template/EditEmailTemplateScreen";

const EmailTemplates_FRAGMENT = graphql`
    fragment EmailTemplatesTable_EmailTemplatesListFragment on Query @refetchable(queryName: "EmailTemplatesTable_Refetch") @argumentDefinitions(
        first: {type: "Int"},
        after: {type: "String"},
    ){
        Admin {
            Email {
                PersonalizedEmailTemplates( first: $first, after: $after) @connection(key: "EmailTemplatesTable_PersonalizedEmailTemplates") {
                    pageInfo {
                        endCursor
                        hasPreviousPage
                        hasNextPage
                        startCursor
                    }
                    edges {
                        node {
                            id
                            template {
                                key
                                subject
                            }
                        }
                    }
                }
            }
        }
        ...NewEmailTemplateButton_AvailableTemplatesFragment
    }
`

const DELETE_MUTATION = graphql`
    mutation EmailTemplatesTable_DeleteMutation($input: DeletePersonalizedEmailTemplateInput!, $connections: [ID!]!) {
        Admin {
            Email{
                deletePersonalizedEmailTemplate(input: $input) {
                    deletedIds @deleteEdge(connections: $connections)
                }
            }
        }
    }
`

interface OwnProps {
    emailTemplatesFragmentRef: EmailTemplatesTable_EmailTemplatesListFragment$key
}

export const EmailTemplatesTable = ({emailTemplatesFragmentRef}: OwnProps) => {
    const navigate = useNavigate();
    const {
        data,
        hasNext,
        loadNext
    } = usePaginationFragment<EmailTemplatesTable_Refetch, EmailTemplatesTable_EmailTemplatesListFragment$key>(EmailTemplates_FRAGMENT, emailTemplatesFragmentRef)


    const [deleteEMailTemplate, isDeleting] = useMutation<EmailTemplatesTable_DeleteMutation>(DELETE_MUTATION);

    const {showDialog, dialogComponent} = useDialogLogic();

    return <>
        {dialogComponent}
        <div className="flex justify-content-end mb-3">
            <NewEmailTemplateButton availableTemplatesFragmentRef={data}/>
        </div>
        <DataTable
            className="mb-3"
            value={data.Admin.Email.PersonalizedEmailTemplates.edges?.map(b => b!.node!) as any[]}
            emptyMessage={"No templates have been overwritten."}
        >
            <Column header="Key" body={item => item.template.key}/>
            <Column header="Subject" field="template.subject"/>
            <Column header="Actions" style={{width: "20%"}} body={item => <>
                <Button
                    className="mr-2"
                    onClick={() => {
                        navigate(EDIT_EMAIL_TEMPLATE_PATH.replace(":emailTemplateId", item.id))
                    }} icon={"pi pi-pencil"}/>

                <Button
                    disabled={isDeleting}
                    onClick={() => {
                        showDialog({
                            title: "Delete email template override?",
                            content: "If you delete this override, the default system template is used.",
                            dialogCallback: result => {
                                if (result === "Accept") {
                                    deleteEMailTemplate({
                                        variables: {
                                            input: {
                                                ids: [item.id]
                                            },
                                            connections: [
                                                ConnectionHandler.getConnectionID("client:root:Admin:Email", "EmailTemplatesTable_PersonalizedEmailTemplates")
                                            ]
                                        },
                                    })
                                }
                            }
                        })
                    }} icon={"pi pi-trash"}/>
            </>}/>
        </DataTable>

        <div className="flex justify-content-center align-items-center">
            <Button className="p-button-secondary" disabled={!hasNext} onClick={() => loadNext(20)}>Load more</Button>
        </div>
    </>
}
