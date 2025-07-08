import {graphql} from "babel-plugin-relay/macro";
import {useEffect, useState} from "react";
import {fetchQuery} from "relay-runtime";
import {readInlineData, useRelayEnvironment} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {
    DivisionSelect_DivisionFragment$data,
    DivisionSelect_DivisionFragment$key
} from "../../__generated__/DivisionSelect_DivisionFragment.graphql";
import {DivisionSelect_Query} from "../../__generated__/DivisionSelect_Query.graphql";
import {Dropdown} from "primereact/dropdown";

const PEOPLE_QUERY = graphql`
    query DivisionSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
        Division {
            Divisions(first: 20, excludeIds: $excludeIds, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
                edges {
                    node {
                        ...DivisionSelect_DivisionFragment
                    }
                }
            }
        }
    }
`

const PERSON_FRAGMENT = graphql`
    fragment DivisionSelect_DivisionFragment on Division @inline{
        id
        name
    }

`


export const DivisionSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
    const environment = useRelayEnvironment();


    const [divisions, setDivision] = useState<DivisionSelect_DivisionFragment$data[]>([])
    useEffect(() => {
        fetchQuery<DivisionSelect_Query>(environment, PEOPLE_QUERY, {})
            .toPromise().then(result => {
            setDivision(() => result!.Division.Divisions.edges!.map(e => readInlineData<DivisionSelect_DivisionFragment$key>(PERSON_FRAGMENT, e!.node!)))
        })
        // eslint-disable-next-line
    }, [])


    return <Dropdown
        name={fieldConfig.fieldName}
        value={fieldConfig.fieldValue}
        disabled={fieldConfig.disabled}
        options={[
            {label: "N/A", value: null},
            ...divisions.map(p => {
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

            fetchQuery<DivisionSelect_Query>(environment, PEOPLE_QUERY, {
                filterByName: e.filter?.length > 0 ? e.filter : undefined,
                alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : [],
            })
                .toPromise().then(result => {
                setDivision(() => result!.Division.Divisions.edges!.map(e => readInlineData<DivisionSelect_DivisionFragment$key>(PERSON_FRAGMENT, e!.node!)))
            })
        }
        }
    />
}
