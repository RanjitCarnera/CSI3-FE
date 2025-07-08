import {graphql} from "babel-plugin-relay/macro";
import {useLazyLoadQuery} from "react-relay";
import {ValidatedFieldConfig} from "../ui/ValidatedField";
import {SelectGroupField_Query} from "../../__generated__/SelectGroupField_Query.graphql";
import React from "react";
import {Dropdown} from "primereact/dropdown";

const QUERY = graphql`
    query SelectGroupField_Query {
        Management {
            Groups(first: 50) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    }
`


export const SelectGroupField = ({
                                     fieldValue,
                                     fieldName,
                                     updateField
                                 }: ValidatedFieldConfig<string>,) => {
    const {Management: {Groups: {edges: groups}}} = useLazyLoadQuery<SelectGroupField_Query>(QUERY, {})


    return <Dropdown
        name={fieldName}
        value={fieldValue}
        options={groups?.map(g => g!.node!).map(p => {
            return ({
                label: p.name,
                name: p.name,
                value: p.id
            });
        })}
        onChange={e => updateField(e.value)}
        filter={true}
        filterBy={"name"}
    />
}
