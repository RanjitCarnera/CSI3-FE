import { graphql } from "babel-plugin-relay/macro";
import { type Button } from "primereact/button";
import { forwardRef, useState } from "react";
import { useFragment } from "react-relay";
import { EditPersonModal } from "./EditPersonModal";
import { type EditPersonButton_PersonFragment$key } from "../../__generated__/EditPersonButton_PersonFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";

const PROJECT_FRAGMENT = graphql`
	fragment EditPersonButton_PersonFragment on Person {
		...EditPersonModal_PersonFragment
	}
`;

interface OwnProps {
	className?: string;
	personFragmentRef: EditPersonButton_PersonFragment$key;
	autoFocus?: boolean;
}

export const EditPersonButton = forwardRef<Button, OwnProps>(
	({ className, personFragmentRef, autoFocus }, ref) => {
		const [isVisible, setVisible] = useState(autoFocus ?? false);
		const Person = useFragment<EditPersonButton_PersonFragment$key>(
			PROJECT_FRAGMENT,
			personFragmentRef,
		);
		return (
			<>
				<TkButtonLink
					ref={ref}
					className={className}
					icon="pi pi-pencil"
					iconPos="left"
					label="Edit"
					onClick={() => {
						setVisible(true);
					}}
				/>

				<EditPersonModal
					isVisible={isVisible}
					onHide={() => {
						setVisible(false);
					}}
					onCompleted={() => {
						setVisible(false);
					}}
					personFragmentRef={Person}
				/>
			</>
		);
	},
);
