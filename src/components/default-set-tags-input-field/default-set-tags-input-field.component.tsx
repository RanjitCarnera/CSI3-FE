import { AutoComplete, type AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import {
	QUERY,
	TAG_INLINE_FRAGMENT,
} from "@components/default-set-tags-input-field/default-set-tags-input-field.graphql";
import { type DefaultSetTagsInputInput } from "@components/default-set-tags-input-field/default-set-tags-input-field.types";
import { type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type defaultSetTagsInputField_Query } from "@relay/defaultSetTagsInputField_Query.graphql";
import {
	type defaultSetTagsInputField_TagInlineFragment$data,
	type defaultSetTagsInputField_TagInlineFragment$key,
} from "@relay/defaultSetTagsInputField_TagInlineFragment.graphql";

export const DefaultSetTagsInputField = ({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
}: ValidatedFieldConfig<DefaultSetTagsInputInput[]>) => {
	const ref = useRef<AutoComplete>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [queriedTags, setQueriedTags] = useState<
		defaultSetTagsInputField_TagInlineFragment$data[]
	>([]);

	const suggestions = useMemo(
		() => queriedTags.filter((tag) => !(fieldValue ?? []).some((e) => e.id === tag.id)),
		[queriedTags, fieldValue],
	);

	const search = useCallback(
		async (name: string) => {
			await fetchQuery<defaultSetTagsInputField_Query>(
				environment,
				QUERY,
				{ name },
				{ fetchPolicy: "store-or-network" },
			)
				.toPromise()
				.then((result) => {
					const nodes = result?.Tag.GetTagsByName.edges?.map((e) => e?.node!) ?? [];
					const tags = nodes.map((node) =>
						readInlineData<defaultSetTagsInputField_TagInlineFragment$key>(
							TAG_INLINE_FRAGMENT,
							node,
						),
					);
					setQueriedTags(tags);
				});
		},
		[fieldValue],
	);

	const onComplete = (event: AutoCompleteCompleteEvent) => {
		const name = event.query.trim();
		void search(name);
	};

	const environment = useRelayEnvironment();
	useEffect(() => {
		void search("");
	}, []);

	const customChipTemplate = (item: DefaultSetTagsInputInput) => {
		return (
			<div
				style={{
					padding: "4px 8px",
					borderRadius: "4px",
					marginRight: "4px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "4px",
				}}
			>
				<div
					style={{
						height: "1rem",
						width: "1rem",
						borderRadius: "100%",
						backgroundColor: item.color,
					}}
				/>
				<span>{item.name}</span>
			</div>
		);
	};
	return (
		<div className="card p-fluid">
			<AutoComplete
				field={"name"}
				multiple
				value={fieldValue}
				suggestions={suggestions.map((e) => ({
					name: e.data.name,
					id: e.id,
					color: e.data.color,
				}))}
				placeholder={placeholder}
				completeMethod={onComplete}
				onChange={(e) => {
					updateField(e.value);
					void search("");
				}}
				className={classNames({ "p-invalid": !isValid })}
				disabled={disabled}
				emptyMessage={"No tags found"}
				ref={ref}
				inputRef={inputRef}
				onFocus={() => {
					ref.current?.show();
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						const filter = ref.current?.getInput().value;
						if (!filter) return;

						updateField([
							...(fieldValue ?? []),
							{ name: filter ?? "", id: "", color: "#000000" },
						]);
						inputRef.current!.value = "";
					}
				}}
				selectedItemTemplate={customChipTemplate}
			/>
		</div>
	);
};
