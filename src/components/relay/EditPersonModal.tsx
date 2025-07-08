import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { PeopleSelect } from "@components/relay/people-select";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { AssignmentRoleSelect } from "./AssignmentRoleSelect";
import { DivisionsSelect } from "./DivisionsSelect";
import { TaggedFileSelectionField } from "./FileSelectionField";
import { RegionsSelect } from "./RegionsSelect";
import { type EditPersonModal_CreateMutation } from "../../__generated__/EditPersonModal_CreateMutation.graphql";
import { type EditPersonModal_EditMutation } from "../../__generated__/EditPersonModal_EditMutation.graphql";
import { type EditPersonModal_PersonFragment$key } from "../../__generated__/EditPersonModal_PersonFragment.graphql";
import { type Address, AddressField } from "../ui/AddressField";
import {
	DefaultCalendarComponent,
	DefaultPercentageFieldComponent,
	DefaultPhoneNumberField,
	DefaultSalaryComponent,
	DefaultTextAreaComponent,
	DefaultTextFieldComponent,
} from "../ui/DefaultTextInput";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField, type ValidatedFieldConfig } from "../ui/ValidatedField";

const PERSON_FRAGMENT = graphql`
	fragment EditPersonModal_PersonFragment on Person {
		id
		name
		email
		phone
		salary
		laborBurdenMultiplier
		startDate
		assignmentRole {
			id
			name
		}
		associatedWithDivisions {
			id
			name
		}
		associatedWithRegions {
			id
			name
		}
		address {
			lineOne
			postalCode
			city
			state
			country
			longitude
			latitude
		}
		comment
		avatar {
			id
			url
		}
		employeeId
		superVisorsRef {
			id
		}
		documents {
			id
		}
	}
`;

const CREATE_MUTATION = graphql`
	mutation EditPersonModal_CreateMutation($input: CreatePersonInput!, $connections: [ID!]!) {
		Staff {
			createPerson(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...EditPersonButton_PersonFragment
					}
				}
			}
		}
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditPersonModal_EditMutation($input: EditPersonInput!) {
		Staff {
			editPerson(input: $input) {
				edge {
					node {
						id
						...EditPersonButton_PersonFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	personFragmentRef?: EditPersonModal_PersonFragment$key | null;
	onCompleted?: (id: string) => void;
	connectionId?: string;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	name?: string;
	email?: string;
	phone?: string;

	startDate?: string;
	salary?: number;

	laborBurdenMultiplier?: number;
	assignmentRole?: string;

	associatedWithDivisions?: string[];
	associatedWithRegions?: string[];

	comment?: string;

	avatarRef?: string;

	address?: Address;
	superVisorsRef: string[];
	employeeId: string;
}

export const EditPersonModal = ({
	personFragmentRef,
	connectionId,
	onCompleted,
	isVisible,
	onHide,
}: OwnProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const person = useFragment<EditPersonModal_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef || null,
	);
	const [create] = useMutation<EditPersonModal_CreateMutation>(CREATE_MUTATION);
	const [edit] = useMutation<EditPersonModal_EditMutation>(EDIT_MUTATION);

	const hasPrivateDataReadPermission = hasPermissions([
		"UserInAccountPermission_PrivateData_Read",
	]);

	const formik = useFormik<FormState>({
		initialValues: {
			name: person?.name,
			email: person?.email || undefined,
			phone: person?.phone || undefined,
			startDate: person?.startDate || undefined,
			salary: person?.salary || undefined,
			laborBurdenMultiplier: person?.laborBurdenMultiplier || undefined,
			assignmentRole: person?.assignmentRole?.id,
			address: person?.address || undefined,
			associatedWithDivisions: person?.associatedWithDivisions?.map((d) => d.id) || [],
			associatedWithRegions: person?.associatedWithRegions?.map((d) => d.id) || [],
			comment: person?.comment || undefined,
			avatarRef: person?.avatar?.id || undefined,
			employeeId: person?.employeeId ?? "",
			superVisorsRef: person?.superVisorsRef?.map((e) => e.id) ?? [],
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
			email: Yup.string().email("E-Mail must be a valid email."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			if (person) {
				edit({
					variables: {
						input: {
							personId: person.id,
							data: {
								name: values.name!,
								email: values.email,
								phone: values.phone,
								startDate: values.startDate,
								salary: values.salary,
								laborBurdenMultiplier: values.laborBurdenMultiplier,
								assignmentRoleRef: values.assignmentRole,
								address: values.address!,
								associatedWithRegionsRef: values.associatedWithRegions,
								associatedWithDivisionsRef: values.associatedWithDivisions,
								comment: values.comment,
								avatarRef: values.avatarRef,
								employeeId: values.employeeId,
								superVisorsRef: values.superVisorsRef,
								documents: person.documents.map((d) => d.id),
							},
						},
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted && onCompleted(response.Staff.editPerson?.edge.node.id!);
						resetForm({});
					},
				});
			} else {
				create({
					variables: {
						input: {
							data: {
								name: values.name!,
								email: values.email,
								phone: values.phone,
								startDate: values.startDate,
								salary: values.salary,
								laborBurdenMultiplier: values.laborBurdenMultiplier,
								assignmentRoleRef: values.assignmentRole,
								address: values.address!,
								associatedWithRegionsRef: values.associatedWithRegions,
								associatedWithDivisionsRef: values.associatedWithDivisions,
								comment: values.comment,
								avatarRef: values.avatarRef,
								employeeId: values.employeeId,
								superVisorsRef: values.superVisorsRef,
								documents: [],
							},
						},
						connections: connectionId ? [connectionId] : [],
					},
					onCompleted: (response) => {
						setSubmitting(false);
						onCompleted && onCompleted(response.Staff.createPerson?.edge.node.id!);
					},
				});
			}
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{person ? "Edit resource" : "Create new resource"}</h1>}
			visible={isVisible}
			onHide={() => {
				onHide();
			}}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => {
							onHide();
						}}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						label={person ? "Save" : "Create"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<FormState, string>
					disabled={!hasPrivateDataReadPermission}
					className="mb-4"
					name={"employeeId"}
					label={"Employee ID"}
					readonlyValue={
						!hasPrivateDataReadPermission ? "********" : formik.values.employeeId
					}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"startDate"}
					label={"Start date"}
					formikConfig={formik}
					component={DefaultCalendarComponent}
				/>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"email"}
					required={true}
					label={"E-Mail"}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>

				<ValidatedField<FormState, string>
					className="mb-4"
					name={"phone"}
					label={"Phone"}
					formikConfig={formik}
					component={DefaultPhoneNumberField}
				/>

				<ValidatedField<FormState, number>
					className="mb-4"
					name={"salary"}
					label={"Salary"}
					iconClass="pi pi-dollar"
					formikConfig={formik}
					component={({
						fieldValue,
						updateField,
						...config
					}: ValidatedFieldConfig<number>) => {
						return (
							<DefaultSalaryComponent
								id={config.fieldName}
								fieldValue={fieldValue}
								updateField={updateField}
								{...config}
							/>
						);
					}}
				/>

				<ValidatedField<FormState, number>
					className="mb-4"
					name={"laborBurdenMultiplier"}
					label={"Labor + Burden mutliplier to salary"}
					placeholder={"140"}
					min={0}
					iconClass="pi pi-percentage"
					helpText={
						"This is the multiplier applied to the person's salary when calculating project budgets. It expresses the overhead to labor costs such as taxes, 401ks etc. Default is 140%"
					}
					formikConfig={formik}
					component={DefaultPercentageFieldComponent}
				/>

				<ValidatedField<FormState, string>
					className="mb-4"
					name={"assignmentRole"}
					label={"Job title"}
					formikConfig={formik}
					component={AssignmentRoleSelect}
				/>

				<ValidatedField<FormState, string[]>
					disabled={!hasPrivateDataReadPermission}
					className="mb-4"
					name={"superVisorsRef"}
					label={"Supervisors"}
					formikConfig={formik}
					readonlyValue={
						!hasPrivateDataReadPermission ? ["********"] : formik.values.superVisorsRef
					}
					component={PeopleSelect}
				/>

				<ValidatedField<FormState, string[]>
					className="mb-4"
					name={"associatedWithDivisions"}
					label={"Associated with Divisions"}
					helpText={
						"If you associate a person with one or more divisions, these will be used for filtering the availability forecast."
					}
					formikConfig={formik}
					component={DivisionsSelect}
				/>

				<ValidatedField<FormState, string[]>
					className="mb-4"
					name={"associatedWithRegions"}
					label={"Associated with Regions"}
					helpText={
						"If you associate a person with one or more regions, these will be used for filtering the availability forecast."
					}
					formikConfig={formik}
					component={RegionsSelect}
				/>

				<ValidatedField<FormState, string>
					className="mb-4"
					name={"comment"}
					label={"Comment"}
					formikConfig={formik}
					component={DefaultTextAreaComponent}
				/>

				<ValidatedField<FormState, string>
					className="mb-4"
					name={"avatarRef"}
					label={"Avatar"}
					formikConfig={formik}
					component={TaggedFileSelectionField(["People"], ".jpg,.png")}
				/>

				<ValidatedField<FormState, Address>
					className="mb-4"
					name={"address"}
					label={"Address"}
					formikConfig={formik}
					component={AddressField}
				/>
			</Form>
		</TkDialog>
	);
};
