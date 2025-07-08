import {Dropdown} from "primereact/dropdown";
import {graphql} from "babel-plugin-relay/macro";
import {useFragment, useMutation} from "react-relay";
import {useState} from "react";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import {
    NewEmailTemplateButton_AvailableTemplatesFragment$key
} from "../../__generated__/NewEmailTemplateButton_AvailableTemplatesFragment.graphql";
import {NewEmailTemplateButton_CreateMutation} from "../../__generated__/NewEmailTemplateButton_CreateMutation.graphql";
import {EDIT_EMAIL_TEMPLATE_PATH} from "../../screens/edit-email-template/EditEmailTemplateScreen";

const AVAILABLE_EMAIL_TEMPLATES_FRAGMENT = graphql`
    fragment NewEmailTemplateButton_AvailableTemplatesFragment on Query {
        Admin {
            Email {
                AvailableSystemTemplates {
                    key
                    previewText
                    subject
                    body
                    variables
                }
            }
        }
    }
`

const NEW_EMAIL_TEMPLATE_MUTATION = graphql`
    mutation NewEmailTemplateButton_CreateMutation($input: CreatePersonalizedEmailTemplateInput!) {
        Admin {
            Email {
                createPersonalizedEmailTemplate(input: $input) {
                    data {
                        node {
                            id
                        }
                    }
                }
            }
        }
    }
`

interface OwnProps {
    availableTemplatesFragmentRef: NewEmailTemplateButton_AvailableTemplatesFragment$key
}

export const NewEmailTemplateButton = ({availableTemplatesFragmentRef}: OwnProps) => {
    const navigate = useNavigate();
    const [create, isCreating] = useMutation<NewEmailTemplateButton_CreateMutation>(NEW_EMAIL_TEMPLATE_MUTATION)
    const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined)

    const availableTemplates = useFragment<NewEmailTemplateButton_AvailableTemplatesFragment$key>(AVAILABLE_EMAIL_TEMPLATES_FRAGMENT, availableTemplatesFragmentRef)

    return <div>
        <Dropdown
            className="mr-2"
            emptyMessage="All email templates have been overwritten"
            placeholder="Select template"
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.value)}
            options={availableTemplates.Admin.Email.AvailableSystemTemplates.map(t => ({
                value: t.key,
                label: t.key
            }))}/>
        <Button
            onClick={() => {
                const selected = availableTemplates.Admin.Email.AvailableSystemTemplates.find(t => t.key === selectedTemplate)!
                create({
                    variables: {
                        input: {
                            data: {...selected, variables: [...selected.variables]},
                        }
                    },
                    onCompleted: r => {
                        navigate(EDIT_EMAIL_TEMPLATE_PATH.replace(":emailTemplateId", r.Admin.Email.createPersonalizedEmailTemplate?.data.node.id!))
                    }
                })
            }
            }
            disabled={availableTemplates.Admin.Email.AvailableSystemTemplates.length === 0 || isCreating || !selectedTemplate}

            label={"Create"}/>
    </div>
}

