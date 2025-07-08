import { Skill } from "@components/relay/skill-multi-select-v2";

export type TemplateStructureDndProps = {
	skills: Skill[];
	setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
	onUpdate: (e: string[]) => void;
};
