import { Dropdown, type DropdownProps } from "primereact/dropdown";
import { useDebouncedState } from "../../hooks/use-debounced-state.hook";

export const DebouncedPrDropdown = <T,>(
	props: Omit<DropdownProps, "onChange"> & {
		onChange: (newValue: T) => void;
	},
) => {
	const [state, setState] = useDebouncedState<T>(
		props.value,
		(newValue) => {
			props.onChange(newValue);
		},
		500,
	);
	return (
		<Dropdown
			{...props}
			value={state}
			onChange={(e) => {
				setState(e.value);
			}}
		/>
	);
};
