import {graphql} from "babel-plugin-relay/macro";
import {useEffect, useState} from "react";
import {fetchQuery} from "relay-runtime";
import {readInlineData, useRelayEnvironment} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {
    DivisionsSelect_DivisionFragment$data,
    DivisionsSelect_DivisionFragment$key
} from "../../__generated__/DivisionsSelect_DivisionFragment.graphql";
import {DivisionsSelect_Query} from "../../__generated__/DivisionsSelect_Query.graphql";
import {MultiSelect} from "primereact/multiselect";

const PEOPLE_QUERY = graphql`
    query DivisionsSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
        Division {
            Divisions(first: 20, excludeIds: $excludeIds, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
                edges {
                    node {
                        ...DivisionsSelect_DivisionFragment
                    }
                }
            }
        }
    }
`

const PERSON_FRAGMENT = graphql`
    fragment DivisionsSelect_DivisionFragment on Division @inline{
        id
        name
    }

`


export const DivisionsSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
    const environment = useRelayEnvironment();


    const [divisions, setDivision] = useState<DivisionsSelect_DivisionFragment$data[]>([])
    useEffect(() => {
        fetchQuery<DivisionsSelect_Query>(environment, PEOPLE_QUERY, {})
            .toPromise().then(result => {
            setDivision(() => result!.Division.Divisions.edges!.map(e => readInlineData<DivisionsSelect_DivisionFragment$key>(PERSON_FRAGMENT, e!.node!)))
        })
        // eslint-disable-next-line
    }, [])


    return <MultiSelect
        disabled={fieldConfig.disabled}
        name={fieldConfig.fieldName}
        value={fieldConfig.fieldValue}
        options={[
            ...divisions.map(p => {
                return ({
                    label: p.name,
                    name: p.name,
                    value: p.id
                });
            })]}
        onChange={e => fieldConfig.updateField(e.value)}
        filter={true}
        placeholder={fieldConfig.placeholder}
        filterBy={"name"}
        onFilter={e => {

            fetchQuery<DivisionsSelect_Query>(environment, PEOPLE_QUERY, {
                filterByName: e.filter?.length > 0 ? e.filter : undefined,
                alwaysIncludeIds: ((fieldConfig.fieldValue?.length || 0) > 0) ? fieldConfig.fieldValue : undefined,
            })
                .toPromise().then(result => {
                setDivision(() => result!.Division.Divisions.edges!.map(e => readInlineData<DivisionsSelect_DivisionFragment$key>(PERSON_FRAGMENT, e!.node!)))
            })
        }
        }
    />
}
