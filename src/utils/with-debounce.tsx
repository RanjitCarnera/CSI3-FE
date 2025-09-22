import React, { type FC, type SetStateAction, useEffect } from "react";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { useDebouncedState } from "../hooks/use-debounced-state.hook";

export const withDebounce = <T, K extends {}>(
	MyFn: FC<ValidatedFieldConfig<T> & K>,
): FC<ValidatedFieldConfig<T> & K> => {
	return (hocProps: ValidatedFieldConfig<T> & K) => {
		const [deboucedState, setDebouncedState] = useDebouncedState(
			hocProps.fieldValue,
			hocProps.updateField,
			500,
		);

		useExternalUpdate(hocProps.fieldValue, setDebouncedState);

		return (
			<MyFn
				{...hocProps}
				fieldValue={deboucedState}
				updateField={(newValue) => {
					setDebouncedState(newValue);
				}}
			/>
		);
	};
};

/**
 * Will update the inner debounced state, when the outer state is changed.
 * Useful when clearing/resetting filters from outside action.
 * @param dep T
 * @param setState React.Dispatch<SetStateAction<T>>
 */
const useExternalUpdate = <T,>(
	dep: T | undefined,
	setState: React.Dispatch<SetStateAction<T | undefined>>,
) => {
	useEffect(() => {
		setState(dep);
	}, [dep]);
};
