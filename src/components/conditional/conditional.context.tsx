import { createContext } from "react";
import { type IConditionalContext } from "./conditional.types";

export const ConditionalContext = createContext<IConditionalContext>({
	isSuccessful: false,
});
