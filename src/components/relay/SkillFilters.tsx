import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { SkillCategorySelect } from "./SkillCategorySelect";
import {
	clearSkillFilters,
	selectSkillFilters,
	setSkillFilters,
} from "../../redux/SkillCategroySlice";
import { TkButton } from "../ui/TkButton";

export const SkillFilters = () => {
	const filters = useSelector(selectSkillFilters);
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
						setSkillFilters({
							...filters,
							filterByName: e.target.value,
						}),
					);
				}}
			/>
			<SkillCategorySelect
				fieldValue={filters.filterBySkillCategoryRef}
				placeholder={"Filter by attribute categories"}
				updateField={(e) => {
					dispatch(
						setSkillFilters({
							...filters,
							filterBySkillCategoryRef: e ?? undefined,
						}),
					);
				}}
			/>
			<div className="flex align-items-center ml-2">
				<TkButton
					className=""
					label={"Reset"}
					icon="pi pi-times"
					onClick={() => {
						dispatch(clearSkillFilters());
					}}
				/>
			</div>
		</div>
	);
};
