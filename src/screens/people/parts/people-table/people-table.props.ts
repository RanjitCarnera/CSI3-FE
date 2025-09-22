import { type activatedPeopleTable_PersonInlineFragment$data } from "@relay/activatedPeopleTable_PersonInlineFragment.graphql";

export interface PeopleTableProps {
	peopleData: activatedPeopleTable_PersonInlineFragment$data[];
	selection: Array<{ id: string }>;
	setSelection: (selection: Array<{ id: string }>) => void;
	hasNext: boolean;
	loadNext: (num: number) => void;
	autoFocusPersonRef?: string;
}
