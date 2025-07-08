import { InputText } from "primereact/inputtext";
import { TkButton } from "../ui/TkButton";
import {
	clearSkillCategoryFilters,
	selectSkillCategoryFilters,
	setSkillCategoryFilters,
} from "../../redux/SkillCategroySlice";
import { useDispatch, useSelector } from "react-redux";

export const SkillCategoryFilters = () => {
	const filters = useSelector(selectSkillCategoryFilters);
	const dispatch = useDispatch();

	return (
		<div className="flex w-12 align-items-center">
			<div className="mr-3">
				<strong>Filters</strong>
			</div>
			<InputText
				className="mr-2"
				value={filters.filterByName || ""}
				placeholder={"Name"}
				onChange={(e) => {
					dispatch(
						setSkillCategoryFilters({
							...filters,
							filterByName: e.target.value,
						}),
					);
				}}
			/>

			<div className="flex align-items-center">
				<TkButton
					className=""
					label={"Reset"}
					icon="pi pi-times"
					onClick={() => {
						dispatch(clearSkillCategoryFilters());
					}}
				/>
			</div>
		</div>
	);
};
