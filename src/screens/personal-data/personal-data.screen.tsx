import React from "react";
import { useLazyLoadQuery } from "react-relay";
import { ChangeNameForm } from "@components/relay/change-name-form/change-name-form.component";
import { ChangeEmailForm } from "@components/relay/ChangeEmailForm";
import { ChangePasswordForm } from "@components/relay/ChangePasswordForm";
import { ChangeShowBudgetForm } from "@components/relay/ChangeShowBudgetForm";
import { BaseSettingsScreen } from "@components/ui/BaseSettingsScreen";
import { TkCard } from "@components/ui/TkCard";
import { type personalDataScreen_Query } from "@relay/personalDataScreen_Query.graphql";
import { TwoFactorAuthForm } from "@screens/personal-data/parts/2fa-form";
import { PreferredViewTypeForm } from "@screens/personal-data/parts/preferred-view-type-form";
import { UnitSystemForm } from "@screens/personal-data/parts/unit-system-form";
import { UtilizationDisplayForm } from "@screens/personal-data/parts/utilization-display-form";
import { VolumePerPersonForm } from "@screens/personal-data/parts/volume-per-person-form";
import { QUERY } from "@screens/personal-data/personal-data.graphql";
import { FormWrapper } from "@screens/personal-data/personal-data.styles";

export const PERSONAL_DATA_SCREEN_PATH = "/settings/personal-data";
export const PersonalDataScreen = () => {
	const query = useLazyLoadQuery<personalDataScreen_Query>(
		QUERY,
		{},
		{ fetchPolicy: "network-only" },
	);
	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Personal Data</h1>
					</div>
				}
			>
				<h3>Change Name</h3>
				<FormWrapper>
					<ChangeNameForm />
				</FormWrapper>
				<h3>Change E-Mail</h3>
				<FormWrapper>
					<ChangeEmailForm />
				</FormWrapper>

				<h3 className="mt-5">Change Password</h3>
				<FormWrapper>
					<ChangePasswordForm />
				</FormWrapper>

				<h3>Show budget</h3>
				<FormWrapper>
					<p>
						The budget and cost calculations take two things into account. The budgeted
						cost uses a given person's role and how many projects this role can work on
						at the same time.
					</p>
					<p>
						For instance, if the role allows for 3 simultaneous projects, this only
						factors 1/3 of the cost into this specific project. This means that the
						budgeted cost assumed perfect utilization. The utilization cost factors in
						the actual utilization of a person. Meaning if they are only utilized an
						average of 50% over the time of the assignment, they count double toward
						this specific assignment and therefore towards the project. This gives you a
						means to tweak the utilization of people within your scenario.
					</p>
				</FormWrapper>

				<FormWrapper>
					<ChangeShowBudgetForm queryFragmentRef={query} />
				</FormWrapper>

				<h3>Show Volume Per Person</h3>
				<FormWrapper>
					<p>
						Volume Per Person is a metric that is visible on the person card in the
						staff view, totalling up the projects volume for each project that this
						person is assigned to for all assignments that are still active. Assignments
						that are still active are all assignments with an endate that lies in the
						future.
					</p>
				</FormWrapper>

				<FormWrapper>
					<VolumePerPersonForm queryFragmentRef={query} />
				</FormWrapper>

				<h3>Preferred View Type</h3>
				<FormWrapper>
					<p>
						If you have default views setup for both the project and staff view. This
						selection will override to which section you will be redirected on reload.
						For instance, if you have a default view for both the project and the staff
						view screen and this setting is set to 'Staff View', on reload you will
						always be redirected to the default view of the staff view.
					</p>
				</FormWrapper>
				<FormWrapper>
					<PreferredViewTypeForm queryFragmentRef={query} />
				</FormWrapper>
				<h3>Unit System</h3>
				<FormWrapper>
					<UnitSystemForm queryFragmentRef={query} />
				</FormWrapper>
				<h3>Utilization display</h3>
				<FormWrapper>
					<p>
						The default being the 'Utilization forecast' showing the utilization average
						from start to the forecast gap set by the corresponding assignment role.
						<br />
						'Utilization today' will show you exactly how the utilization is today.
					</p>
					<UtilizationDisplayForm queryFragmentRef={query} />
				</FormWrapper>
				<h3>2FA</h3>
				<FormWrapper>
					<TwoFactorAuthForm queryFragmentRef={query} />
				</FormWrapper>
			</TkCard>
		</BaseSettingsScreen>
	);
};
