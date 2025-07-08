import { selectIsProjectsExpanded, setProjectsExpanded } from "../../redux/ProjectViewSlice";
import { CloseFullscreen, OpenInFull } from "@mui/icons-material";
import { TkSelectButton } from "./TkSelectButton";
import { useDispatch, useSelector } from "react-redux";

interface OwnProps {
	className?: string;
}

export const ExpandProjectsButton = ({ className }: OwnProps) => {
	const dispatch = useDispatch();
	const isProjectsExpanded = useSelector(selectIsProjectsExpanded);

	return (
		<div className={className}>
			<TkSelectButton
				itemTemplate={(e) => {
					return e ? <OpenInFull /> : <CloseFullscreen />;
				}}
				value={isProjectsExpanded}
				options={[false, true]}
				onChange={(e) => dispatch(setProjectsExpanded(e.value))}
			/>
		</div>
	);
};
