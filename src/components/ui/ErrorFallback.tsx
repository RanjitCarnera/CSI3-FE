import React from "react";
import { TkButton } from "./TkButton";
import { TkCard } from "./TkCard";

export const ErrorFallback = () => {
	return (
		<TkCard className="flex flex-grow-1 text-center justify-content-center align-items-center">
			<h1>There was an error when loading this application.</h1>
			<TkButton
				label={"Try again"}
				onClick={() => {
					localStorage.clear();
					window.location.reload();
				}}
			/>
		</TkCard>
	);
};
