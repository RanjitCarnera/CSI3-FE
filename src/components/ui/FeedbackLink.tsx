import { TkButton } from "./TkButton";

interface OwnProps {
	className?: string;
}

export const FeedbackLink = ({ className }: OwnProps) => {
	return (
		<a className={className} href="mailto:info@teamweave.io">
			<TkButton icon="pi pi-envelope" label="Feedback" />
		</a>
	);
};
