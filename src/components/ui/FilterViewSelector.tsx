import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import {
	type ProjectViewState,
	setProjectViewPeopleFilters,
	setProjectViewProjectFilters,
} from "@redux/ProjectViewSlice";
import { setStaffViewFilters, type StaffViewState } from "@redux/StaffViewSlice";
import {
	getTypedFiltersFromUrl,
	isProjectViewState,
	isStaffViewStateType,
} from "@utils/url-filters.utils";
import { FilterViewNameForm } from "./FilterViewNameForm";
import { TkButton } from "./TkButton";
import { TkDialog } from "./TkDialog";
import { type FilterViewSelector_DeleteMutation } from "../../__generated__/FilterViewSelector_DeleteMutation.graphql";
import {
	type FilterViewSelector_QueryFragment$key,
	type ViewType,
} from "../../__generated__/FilterViewSelector_QueryFragment.graphql";
import { type FilterViewSelector_UpsertMutation } from "../../__generated__/FilterViewSelector_UpsertMutation.graphql";

const FRAGMENT = graphql`
	fragment FilterViewSelector_QueryFragment on Query
	@argumentDefinitions(filterByViewType: { type: "ViewType!" }) {
		Views {
			ViewOptions(first: 20, filterByViewType: $filterByViewType)
				@connection(key: "FilterViewSelector_ViewOptions") {
				__id
				edges {
					node {
						id
						name
						viewType
						url
						isDefault
					}
				}
			}
		}
	}
`;

const UPSERT_MUTATION = graphql`
	mutation FilterViewSelector_UpsertMutation(
		$input: UpsertViewOptionInput!
		$connections: [ID!]!
	) {
		Views {
			upsertViewOptions(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						name
						viewType
						url
						isDefault
					}
				}
			}
		}
	}
`;

const DELETE_MUTATION = graphql`
	mutation FilterViewSelector_DeleteMutation(
		$input: DeleteViewOptionsInput!
		$connections: [ID!]!
	) {
		Views {
			deleteViewOptions(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;

interface DropdownOption {
	label: string;
	value: string;
}
interface OwnProps {
	viewType: ViewType;
	queryFragmentRef: FilterViewSelector_QueryFragment$key;
}

export const FilterViewSelector = ({ viewType, queryFragmentRef }: OwnProps) => {
	const query = useFragment<FilterViewSelector_QueryFragment$key>(FRAGMENT, queryFragmentRef);
	const [upsert, isUpserting] = useMutation<FilterViewSelector_UpsertMutation>(UPSERT_MUTATION);
	const [doDelete, isDeleting] = useMutation<FilterViewSelector_DeleteMutation>(DELETE_MUTATION);

	const [selectedView, setSelectedView] = useState<string | undefined>();
	const [isVisible, setVisible] = useState(false);
	const [willBeDefault, setWillBeDefault] = useState(false);

	const viewOptions = query?.Views.ViewOptions.edges?.map((e) => e!.node!) || [];
	const defaultView = viewOptions.find((view) => view.isDefault)?.id;
	const itemTemplate = (option: DropdownOption) => {
		if (option) {
			const isDefault = defaultView === option.value;
			return (
				<div
					className={classNames({
						"flex align-items-center justify-content-between": true,
					})}
				>
					<div>{option.label}</div>
					{isDefault && <div className="pi pi-star"></div>}
				</div>
			);
		}
	};
	const valueTemplate = (option: DropdownOption, props: any) => {
		if (option) {
			return (
				<div className="flex align-items-center">
					<div>{option.label}</div>
				</div>
			);
		}

		return <span>{props.placeholder}</span>;
	};

	useEffect(() => {
		if (!isVisible) setWillBeDefault(false);
	}, [isVisible]);

	const dispatch = useDispatch();

	const handleOnClick = useCallback(() => {
		const view = viewOptions?.find((v) => v.id === selectedView);
		if (!view) return toast.error("View was not found.");
		match(viewType)
			.with("ProjectView", () => {
				const projectViewState = getTypedFiltersFromUrl<ProjectViewState>(
					view.url,
					isProjectViewState,
				);
				if (!projectViewState) return toast.error("Something went wrong.");
				dispatch(setProjectViewPeopleFilters(projectViewState.peopleFilters));
				dispatch(setProjectViewProjectFilters(projectViewState.projectFilters));
				toast.success("View was loaded.");
			})
			.with("StaffView", () => {
				const staffViewState = getTypedFiltersFromUrl<StaffViewState>(
					view.url,
					isStaffViewStateType,
				);
				if (!staffViewState) return toast.error("Something went wrong.");
				dispatch(setStaffViewFilters(staffViewState.filters));
				toast.success("View was loaded.");
			})
			.exhaustive();
	}, [selectedView, viewOptions, viewType]);
	return (
		<div className="flex">
			<Dropdown
				placeholder="Select view to load"
				options={viewOptions.map((view) => {
					return {
						label: view.name,
						value: view.id,
					};
				})}
				onChange={(e) => {
					setSelectedView(e.value);
				}}
				value={selectedView}
				className="mr-2"
				style={{ width: 200 }}
				itemTemplate={itemTemplate}
				valueTemplate={valueTemplate}
			/>
			<TkButton
				disabled={!selectedView || viewOptions?.length === 0}
				icon="pi pi-arrow-up"
				className="mr-2"
				onClick={handleOnClick}
			/>
			<TkButton
				disabled={!selectedView || viewOptions?.length === 0 || isDeleting}
				icon="pi pi-trash"
				className="mr-2"
				onClick={() => {
					if (selectedView) {
						doDelete({
							variables: {
								input: {
									ids: [selectedView],
								},
								connections: [query?.Views.ViewOptions.__id!],
							},
							onCompleted: () => {
								setSelectedView(undefined);
							},
						});
					}
				}}
			/>
			<TkButton
				className={"mr-2"}
				icon="pi pi-save"
				disabled={isDeleting || isUpserting}
				onClick={() => {
					setVisible(true);
				}}
			/>
			<TkButton
				tooltip={"Make default view"}
				icon={"pi pi-star"}
				onClick={() => {
					setWillBeDefault(true);
					setVisible(true);
				}}
			/>

			<TkDialog
				header={<h1>Save view options</h1>}
				onHide={() => {
					setVisible(false);
				}}
				visible={isVisible}
			>
				<FilterViewNameForm
					initialWillBeDefault={willBeDefault}
					onSubmit={(input, callback) => {
						upsert({
							variables: {
								input: {
									name: input.name,
									viewType,
									url: window.location.href,
									isDefault: input.isDefault,
								},
								connections: [query?.Views.ViewOptions.__id!],
							},
							onError: (e) => {
								console.error(e);
							},
							onCompleted: (e) => {
								setSelectedView(e.Views.upsertViewOptions?.edge.node.id);
								setVisible(false);
								callback();
							},
						});
					}}
				/>
			</TkDialog>
		</div>
	);
};
