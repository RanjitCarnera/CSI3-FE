import pkceChallenge from "pkce-challenge";

/**
 * Generate PKCE code challenge and code verifier, saving code-verifier to local storage
 * @returns code-challenge
 */
export const generatePKCEChallengeAndVerifier = async () => {
	return await pkceChallenge(128);
};

/**
 * Inject coverVerifier and email to state param.
 * @param url url
 * @param codeVerifier - code verifier
 * @returns url with new state param
 */
export const patchStateParamInRedirectUrl = (url: string, codeVerifier: string) => {
	const getUrlParams = (url: string) => {
		const params = new URLSearchParams(new URL(url).search);
		return {
			state: params.get("state"),
			params,
		};
	};

	const toBase64 = (obj: Record<string, string>) => {
		return btoa(JSON.stringify(obj));
	};

	const { state, params } = getUrlParams(url);

	if (state) {
		const encodedObject = {
			email: state,
			codeVerifier,
		};

		const base64Encoded = toBase64(encodedObject);

		params.set("state", base64Encoded);

		const baseUrl = url.split("?")[0];
		const newUrl = `${baseUrl}?${params.toString()}`;

		return newUrl;
	}

	return url;
};
