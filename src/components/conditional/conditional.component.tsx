import { type PropsWithChildren, useContext } from "react";
import { ConditionalContext } from "./conditional.context";

const ConditionalRoot = ({ condition, children }: PropsWithChildren<{ condition: boolean }>) => {
	return (
		<ConditionalContext.Provider
			value={{
				isSuccessful: condition,
			}}
		>
			{children}
		</ConditionalContext.Provider>
	);
};

const ConditionalSuccess = ({ children }: PropsWithChildren) => {
	const { isSuccessful } = useContext(ConditionalContext);
	if (!isSuccessful) return null;
	return <>{children}</>;
};
const ConditionalFallback = ({ children }: PropsWithChildren) => {
	const { isSuccessful } = useContext(ConditionalContext);
	if (isSuccessful) return null;
	return <>{children}</>;
};

const Conditional = {
	Root: ConditionalRoot,
	Success: ConditionalSuccess,
	Fallback: ConditionalFallback,
};
export { Conditional, ConditionalRoot, ConditionalFallback, ConditionalSuccess };
