export const setSearchParams = (key: string, value: string, newUrl?: string) => {
	const url = newUrl ? new URL(newUrl, window.location as any) : new URL(window.location as any);
	if (value) {
		url.searchParams.set(key, value);
	} else {
		url.searchParams.delete(key);
	}
	window.history.pushState(null, "", url.toString());
};

export function initializeFromUrl<T>(searchParam: string, baseState: T) {
	const initialStateString = new URLSearchParams(window.location.search).get(searchParam);
	let initialState: T = baseState;
	try {
		initialState = initialStateString ? JSON.parse(atob(initialStateString)) : initialState;
	} catch {}
	return initialState;
}

export function updateUrl<T>(searchParam: string, state: T, baseState: T, newUrl?: string) {
	if (JSON.stringify(baseState) !== JSON.stringify(state)) {
		const filterJson = btoa(JSON.stringify(state));
		setSearchParams(searchParam, filterJson, newUrl);
	} else {
		setSearchParams(searchParam, "", newUrl);
	}
}
