import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

/**
 * A hook that debounces the state and calls the callback function when the state changes by 500ms.
 * @param initialValue - initial state
 * @param callback - callback function to be called when the state changes
 * @param duration - delay in ms
 * @returns [state, setState] - state and setState function
 */
export const useDebouncedState = <T,>(
	initialValue: T,
	callback: (state: T) => void,
	duration: number = 500,
): [T, Dispatch<SetStateAction<T>>] => {
	const [state, setState] = useState<T>(initialValue);
	useEffect(() => {
		const timeout = setTimeout(() => {
			callback(state);
		}, duration);

		return () => {
			clearTimeout(timeout);
		};
	}, [state]);

	return [state, setState];
};
