import { type InputVariant } from "@thekeytechnology/framework-react-components";
import { type StatusMap } from "@components/relay/edit-skill-association-modal/edit-skill-association-modal.types";

export const headerMap: StatusMap<string> = {
	decrease: "Downgrade Skill",
	increase: "Upgrade Skill",
	noChange: "Clear Skill",
};
export const buttonLabelMap: StatusMap<string> = {
	decrease: "Downgrade",
	increase: "Upgrade",
	noChange: "Clear",
};
export const inputVariantMap: StatusMap<InputVariant> = {
	increase: "solid",
	decrease: "error",
	noChange: "error",
};
