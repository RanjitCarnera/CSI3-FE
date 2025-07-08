import React from "react";
import { getCookieName } from "@screens/skill-assessment/parts/skill-assessment-login/skill-assessment-login.util";
import { useCookies } from "react-cookie";
import { Login } from "@screens/skill-assessment/parts/skill-assessment-login";

export const formatDate = (date: Date) => {
	const formatter = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	});
	const [month, _, day, ___, year] = formatter.formatToParts(date);
	return `${month.value}. ${day.value}, ${year.value}`;
};

export const withAssessmentLogin = (
	Component: React.FC<{ password?: string }>,
	accountId: string,
) => {
	const cookieName = getCookieName(accountId);
	const [cookies] = useCookies([cookieName]);
	const passwordCookie = cookies[cookieName];
	if (passwordCookie) return <Component password={passwordCookie} />;

	return <Login accountId={accountId} />;
};
