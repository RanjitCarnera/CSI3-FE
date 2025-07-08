import { useEffect } from "react";

export const ResetScreen = () => {
	useEffect(() => {
		localStorage.clear();
		window.location.href = "/";
	}, []);

	return <div></div>;
};
