import React, { type PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { Conditional } from "@components/conditional";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";
import { type FeatureId } from "@relay/PermissionBasedNavigation_Query.graphql";

export const WithFeatureToggle = ({
	featureId,
	children,
}: PropsWithChildren<{ featureId: FeatureId }>) => {
	const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);

	return (
		<Conditional.Root condition={activeFeatureToggleIds.includes(featureId)}>
			<Conditional.Success children={children} />
		</Conditional.Root>
	);
};

export const withFeatureToggle = <T extends object>(featureId: FeatureId, FC: React.FC<T>) => {
	return (props: T) => {
		const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
		const isActive = activeFeatureToggleIds.includes(featureId);
		if (!isActive) return null;
		return <FC {...props} />;
	};
};
