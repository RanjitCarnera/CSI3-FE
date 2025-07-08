import { ProgressBarProps } from "@components/relay/project-details-control/parts/progress-bar/progress-bar.types";
import {
	InvisibleItem,
	VisibleItem,
	Wrapper,
} from "@components/relay/project-details-control/parts/progress-bar/progress-bar.styles";

export const ProgressBar = ({ value, max, id }: ProgressBarProps) => {
	return (
		<Wrapper id={id}>
			{new Array(max)
				.fill(0)
				.map((_, i) => (i + 1 <= value ? <VisibleItem /> : <InvisibleItem />))}
		</Wrapper>
	);
};
