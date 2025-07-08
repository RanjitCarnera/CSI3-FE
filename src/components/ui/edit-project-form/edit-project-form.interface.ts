import { type FormikHelpers } from "formik";
import { type ProjectSource } from "@relay/ProjectsTable_ProjectFragment.graphql";
import { type Address } from "../AddressField";

export interface EditProjectFormState {
	name?: string;
	startDate?: string;
	endDate?: string;
	address?: Address;
	architectName?: string;
	clientName?: string;
	divisionRef?: string;
	regionRef?: string;
	stageRef?: string;
	volume?: number;

	generalConditionsPercentage?: number;
	budgetedLaborCosts?: number;
	moveAssigmentStartDates?: boolean;
	moveAssigmentEndDates?: boolean;
	projectIdentifier?: string;

	avatarRef?: string;
	skillsRef?: string[];
	milestones?: Milestone[];
	comments?: string;
	source?: ProjectSource;
}

export interface Milestone {
	id?: string;
	name: string;
	date: string;
}

export interface EditProjectFormProps {
	initialState?: EditProjectFormState;
	onSubmit: (
		values: EditProjectFormState,
		formikHelpers: FormikHelpers<EditProjectFormState>,
	) => void;
	comparisonProjectState?: EditProjectFormState;
}
