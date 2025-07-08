import {graphql} from "babel-plugin-relay/macro";
import {useEffect, useState} from "react";
import {fetchQuery} from "relay-runtime";
import {readInlineData, useRelayEnvironment} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {
    StaffingTemplateSelect_StaffingTemplateFragment$data,
    StaffingTemplateSelect_StaffingTemplateFragment$key
} from "../../__generated__/StaffingTemplateSelect_StaffingTemplateFragment.graphql";
import {StaffingTemplateSelect_Query} from "../../__generated__/StaffingTemplateSelect_Query.graphql";
import {Dropdown} from "primereact/dropdown";

const QUERY = graphql`
    query StaffingTemplateSelect_Query($filterByName: String,  $alwaysIncludeIds: [ID!]) {
        Template {
            StaffingTemplates(first: 20, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
                edges {
                    node {
                        ...StaffingTemplateSelect_StaffingTemplateFragment
                    }
                }
            }
        }
    }
`

const FRAGMENT = graphql`
    fragment StaffingTemplateSelect_StaffingTemplateFragment on StaffingTemplate @inline{
        id
        name
    }

`


export const StaffingTemplateSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
    const environment = useRelayEnvironment();

    const [staffingTemplate, setStaffingTemplates] = useState<StaffingTemplateSelect_StaffingTemplateFragment$data[]>([])
    useEffect(() => {
        fetchQuery<StaffingTemplateSelect_Query>(environment, QUERY, {})
            .toPromise().then(result => {
            setStaffingTemplates(() => result!.Template.StaffingTemplates.edges!.map(e => readInlineData<StaffingTemplateSelect_StaffingTemplateFragment$key>(FRAGMENT, e!.node!)))
        })
        // eslint-disable-next-line
    }, [])


    return <Dropdown
        name={fieldConfig.fieldName}
        value={fieldConfig.fieldValue}
        options={[
            ...staffingTemplate.map(p => {
                return ({
                    label: p.name,
                    name: p.name,
                    value: p.id
                });
            })
        ]}
        onChange={e => fieldConfig.updateField(e.value)}
        filter={true}
        filterBy={"name"}
        emptyMessage={"You don't have staffing templates yet. Create some in settings."}
        placeholder={fieldConfig.placeholder}
        onFilter={e => {
            fetchQuery<StaffingTemplateSelect_Query>(environment, QUERY, {
                filterByName: e.filter?.length > 0 ? e.filter : undefined,
                alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : undefined,
            })
                .toPromise().then(result => {
                setStaffingTemplates(() => result!.Template.StaffingTemplates.edges!.map(e => readInlineData<StaffingTemplateSelect_StaffingTemplateFragment$key>(FRAGMENT, e!.node!)))
            })
        }
        }
    />
}
