import { Tooltip } from "@thekeytechnology/framework-react-components";
import { useId } from "react";
import { TooltipIcon } from "./TooltipIcon";

interface OwnProps {
	className?: string;
	comment?: string;
}

export const CommentIcon = ({ className, comment }: OwnProps) => {
	const id = useId().replace(":", "").replace(":", "");

	return (
		<div id={id}>
			<Tooltip target={`#${id}`} content={comment} />
			<TooltipIcon icon="pi pi-comment" className={className} />
		</div>
	);
};
