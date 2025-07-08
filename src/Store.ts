import { configureStore } from "@reduxjs/toolkit";
import { FeatureTogglesReducer } from "@redux/feature-toggles/feature-toggles.slice";
import { MilestoneTemplateSliceReducer } from "@redux/milestone-template.slice";
import { SkillAssessmentTemplatesSliceReducer } from "@redux/skill-assessment-templates-slice";
import { SkillAssessmentSliceReducer } from "@redux/skill-assessments.slice";
import { AssignmentRoleSliceReducer } from "./redux/AssignmentRoleSlice";
import { AuthSliceReducer } from "./redux/AuthSlice";
import { AvailabilityForecastSliceReducer } from "./redux/AvailabilityForecastSlice";
import { CurrentUserSliceReducer } from "./redux/CurrentUserSlice";
import { DivisionSliceReducer } from "./redux/DivisionSlice";
import { MapReducer } from "./redux/MapSlice";
import { PeopleSliceReducer } from "./redux/PeopleSlice";
import { ProjectSliceReducer } from "./redux/ProjectSlice";
import { ProjectStageSliceReducer } from "./redux/ProjectStageSlice";
import { ProjectViewSliceReducer } from "./redux/ProjectViewSlice";
import { RegionSliceReducer } from "./redux/RegionSlice";
import { ScenarioSliceReducer } from "./redux/ScenarioSlice";
import { SkillCategorySliceReducer } from "./redux/SkillCategroySlice";
import { StaffingTemplateSliceReducer } from "./redux/StaffingTemplatesSlice";
import { StaffViewSliceReducer } from "./redux/StaffViewSlice";
import { CucTemplateSliceReducer } from "@redux/cuc-templates.slice";

export const ReduxStore = configureStore({
	reducer: {
		auth: AuthSliceReducer,
		scenario: ProjectViewSliceReducer,
		people: PeopleSliceReducer,
		region: RegionSliceReducer,
		assignmentRoles: AssignmentRoleSliceReducer,
		division: DivisionSliceReducer,
		staffView: StaffViewSliceReducer,
		currentUser: CurrentUserSliceReducer,
		skills: SkillCategorySliceReducer,
		projects: ProjectSliceReducer,
		scenarios: ScenarioSliceReducer,
		availabilityForecast: AvailabilityForecastSliceReducer,
		projectStage: ProjectStageSliceReducer,
		staffingTemplate: StaffingTemplateSliceReducer,
		map: MapReducer,
		skillAssessments: SkillAssessmentSliceReducer,
		skillAssessmentTemplates: SkillAssessmentTemplatesSliceReducer,
		featureToggles: FeatureTogglesReducer,
		milestoneTemplates: MilestoneTemplateSliceReducer,
		cucTemplates: CucTemplateSliceReducer,
	},
});
export type ReduxState = ReturnType<typeof ReduxStore.getState>;
