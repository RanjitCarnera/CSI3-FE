import { InputText, type InputTextProps } from "primereact/inputtext";
import styled from "styled-components";
import { useDebouncedState } from "../../hooks/use-debounced-state.hook";

export const TkInputText = styled(InputText)`
	color: var(--text);
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.1876em;
	border-radius: 4px;
	height: 30px;
`;

export const DebouncedTkInputText = (
	props: Omit<InputTextProps, "onChange"> & {
		onChange: (newValue: string | undefined | null) => void;
	},
) => {
	const [state, setState] = useDebouncedState<string | undefined>(
		props.value,
		(newValue) => {
			props.onChange(newValue);
		},
		500,
	);
	return (
		<TkInputText
			{...props}
			value={state}
			onChange={(e) => {
				setState(e.target.value);
			}}
		/>
	);
};
