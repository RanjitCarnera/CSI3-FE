import React, { Suspense } from "react";

export const withFieldFallback = <T extends {}>(FC: React.FC<T>) => {
	return (props: T) => (
		<Suspense fallback={<div>Loading...</div>}>
			<FC {...props} />
		</Suspense>
	);
};
