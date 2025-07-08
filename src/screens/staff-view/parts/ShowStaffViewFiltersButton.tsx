import { TkButton } from "../../../components/ui/TkButton";
import {
	selectIsStaffViewFiltersVisible,
	setStaffViewFiltersVisible,
} from "../../../redux/StaffViewSlice";
import { useDispatch, useSelector } from "react-redux";

interface OwnProps {
	className?: string;
}

export const ShowProjectFiltersButton = ({ className }: OwnProps) => {
	const isProjectFiltersVisible = useSelector(selectIsStaffViewFiltersVisible);
	const dispatch = useDispatch();

	return (
		<div className={className}>
			<TkButton
				label={isProjectFiltersVisible ? "Hide filters" : "Show filters"}
				onClick={() => dispatch(setStaffViewFiltersVisible(!isProjectFiltersVisible))}
				icon={isProjectFiltersVisible ? "pi pi-chevron-up" : "pi pi-chevron-down"}
			/>
		</div>
	);
};
