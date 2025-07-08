import {graphql} from "babel-plugin-relay/macro";
import {useEffect, useState} from "react";
import {fetchQuery} from "relay-runtime";
import {readInlineData, useRelayEnvironment} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {
    RegionSelect_RegionFragment$data,
    RegionSelect_RegionFragment$key
} from "../../__generated__/RegionSelect_RegionFragment.graphql";
import {RegionSelect_Query} from "../../__generated__/RegionSelect_Query.graphql";
import {Dropdown} from "primereact/dropdown";

const PEOPLE_QUERY = graphql`
    query RegionSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
        Region {
            Regions(first: 20, excludeIds: $excludeIds, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
                edges {
                    node {
                        ...RegionSelect_RegionFragment
                    }
                }
            }
        }
    }
`

const PERSON_FRAGMENT = graphql`
    fragment RegionSelect_RegionFragment on Region @inline{
        id
        name
    }

`


export const RegionSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
    const environment = useRelayEnvironment();


    const [regions, setRegion] = useState<RegionSelect_RegionFragment$data[]>([])
    useEffect(() => {
        fetchQuery<RegionSelect_Query>(environment, PEOPLE_QUERY, {})
            .toPromise().then(result => {
            setRegion(() => result!.Region.Regions.edges!.map(e => readInlineData<RegionSelect_RegionFragment$key>(PERSON_FRAGMENT, e!.node!)))
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
            fetchQuery<RegionSelect_Query>(environment, PEOPLE_QUERY, {
                filterByName: e.filter?.length > 0 ? e.filter : undefined,
                alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : [],
            })
                .toPromise().then(result => {
                setRegion(() => result!.Region.Regions.edges!.map(e => readInlineData<RegionSelect_RegionFragment$key>(PERSON_FRAGMENT, e!.node!)))
            })
        }
        }
    />
}
