import {graphql} from "babel-plugin-relay/macro";
import {useEffect, useState} from "react";
import {fetchQuery} from "relay-runtime";
import {readInlineData, useRelayEnvironment} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {
    ProjectsSelectField_ProjectFragment$data,
    ProjectsSelectField_ProjectFragment$key
} from "../../__generated__/ProjectsSelectField_ProjectFragment.graphql";
import {ProjectsSelectField_Query} from "../../__generated__/ProjectsSelectField_Query.graphql";
import {MultiSelect} from "primereact/multiselect";

const PROJECTS_QUERY = graphql`
    query ProjectsSelectField_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
        Project {
            Projects(first: 250, excludeIds: $excludeIds, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
                edges {
                    node {
                        ...ProjectsSelectField_ProjectFragment
                    }
                }
            }
        }
    }
`

const PROJECT_FRAGMENT = graphql`
    fragment ProjectsSelectField_ProjectFragment on Project @inline{
        id
        name
    }

`


interface OwnProps {
    excludeIds?: string[]
    fieldConfig: ValidatedFieldConfig<string[]>,
}


export const ProjectsSelectField = ({
                                        fieldConfig,
                                        excludeIds
                                    }: OwnProps) => {
    const environment = useRelayEnvironment();


    const [projects, setProjects] = useState<ProjectsSelectField_ProjectFragment$data[]>([])
    useEffect(() => {
        fetchQuery<ProjectsSelectField_Query>(environment, PROJECTS_QUERY, {excludeIds: excludeIds})
            .toPromise().then(result => {
            setProjects(() => result!.Project.Projects.edges!.map(e => readInlineData<ProjectsSelectField_ProjectFragment$key>(PROJECT_FRAGMENT, e!.node!)))
        })
        // eslint-disable-next-line
    }, [])


    return <MultiSelect
        name={fieldConfig.fieldName}
        value={fieldConfig.fieldValue}
        options={projects.map(p => {
            return ({
                label: p.name,
                name: p.name,
                value: p.id
            });
        })}
        disabled={fieldConfig.disabled}
        placeholder={fieldConfig.placeholder}
        onChange={e => fieldConfig.updateField(e.value)}
        filter={true}
        filterBy={"name"}
        onFilter={e => {
            fetchQuery<ProjectsSelectField_Query>(environment, PROJECTS_QUERY, {
                filterByName: e.filter?.length > 0 ? e.filter : undefined,
                alwaysIncludeIds: ((fieldConfig.fieldValue?.length || 0) > 0) ? fieldConfig.fieldValue : undefined,
                excludeIds: excludeIds,
            })
                .toPromise().then(result => {
                setProjects(() => result!.Project.Projects.edges!.map(e => readInlineData<ProjectsSelectField_ProjectFragment$key>(PROJECT_FRAGMENT, e!.node!)))
            })
        }
        }
    />
}
