import { InputNumber, type InputNumberProps } from "primereact/inputnumber";
import { useDebouncedState } from "../../hooks/use-debounced-state.hook";

export const DebouncedPrInputNumber = (
	props: Omit<InputNumberProps, "onChange"> & {
		onChange: (newValue: number | undefined | null) => void;
	},
) => {
	const [state, setState] = useDebouncedState<number | undefined | null>(
		props.value,
		(newValue) => {
			props.onChange(newValue);
		},
		500,
	);
	return (
		<InputNumber
			{...props}
			value={state}
			onChange={(e) => {
				setState(e.value);
			}}
		/>
	);
};
