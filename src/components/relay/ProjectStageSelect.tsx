import {graphql} from "babel-plugin-relay/macro";
import {useEffect, useState} from "react";
import {fetchQuery} from "relay-runtime";
import {readInlineData, useRelayEnvironment} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {
    ProjectStageSelect_ProjectStageFragment$data,
    ProjectStageSelect_ProjectStageFragment$key
} from "../../__generated__/ProjectStageSelect_ProjectStageFragment.graphql";
import {ProjectStageSelect_Query} from "../../__generated__/ProjectStageSelect_Query.graphql";
import {Dropdown} from "primereact/dropdown";

const PEOPLE_QUERY = graphql`
    query ProjectStageSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
        Project {
            ProjectStages(first: 20, excludeIds: $excludeIds, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
                edges {
                    node {
                        ...ProjectStageSelect_ProjectStageFragment
                    }
                }
            }
        }
    }
`

const PERSON_FRAGMENT = graphql`
    fragment ProjectStageSelect_ProjectStageFragment on ProjectStage @inline{
        id
        name
    }

`


export const ProjectStageSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
    const environment = useRelayEnvironment();


    const [regions, setProjectStage] = useState<ProjectStageSelect_ProjectStageFragment$data[]>([])
    useEffect(() => {
        fetchQuery<ProjectStageSelect_Query>(environment, PEOPLE_QUERY, {})
            .toPromise().then(result => {
            setProjectStage(() => result!.Project.ProjectStages.edges!.map(e => readInlineData<ProjectStageSelect_ProjectStageFragment$key>(PERSON_FRAGMENT, e!.node!)))
        })
        // eslint-disable-next-line
    }, [])


    return <Dropdown
        name={fieldConfig.fieldName}
        value={fieldConfig.fieldValue}
        disabled={fieldConfig.disabled}
        options={[
            {label: "N/A", value: null},
            ...regions.map(p => {
                return ({
                    label: p.name,
                    name: p.name,
                    value: p.id
                });
            })]}
        onChange={e => fieldConfig.updateField(e.value)}
        filter={true}
        filterBy={"name"}
        onFilter={e => {
            fetchQuery<ProjectStageSelect_Query>(environment, PEOPLE_QUERY, {
                filterByName: e.filter?.length > 0 ? e.filter : undefined,
                alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : [],
            })
                .toPromise().then(result => {
                setProjectStage(() => result!.Project.ProjectStages.edges!.map(e => readInlineData<ProjectStageSelect_ProjectStageFragment$key>(PERSON_FRAGMENT, e!.node!)))
            })
        }
        }
    />
}
