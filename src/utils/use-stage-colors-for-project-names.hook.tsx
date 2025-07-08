import { useSelector } from "react-redux";
import { selectCurrentAccountId } from "@redux/AuthSlice";
import { selectCurrentUser } from "@redux/CurrentUserSlice";

export const useUseStageColorsForProjectNames = () => {
	const cu = useSelector(selectCurrentUser);
	const currentAccountId = useSelector(selectCurrentAccountId);
	const encrypted = window.btoa("Account:" + (currentAccountId ?? ""));
	if (!cu) return false;

	const currentAccount = cu.accounts.find((e) => e.id === encrypted);
	if (!currentAccount) return false;

	const ext = currentAccount?.extensions.find((e) => e.kind === "AccountSettings");
	if (!ext) return false;

	return ext?.useStagesColorsForProjectNames ?? true;
};
