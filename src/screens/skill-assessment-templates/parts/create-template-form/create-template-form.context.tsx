import React, { createContext, PropsWithChildren, useState } from "react";
import { Skill } from "@components/relay/skill-multi-select-v2";

export type ICreateTemplateFormContext = {
	connectionId: string;
	setConnectionId: (connectionId: string) => void;
	skills: Skill[];
	setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
};
export const CreateTemplateFormContext = createContext<ICreateTemplateFormContext>({
	skills: [],
	setSkills: () => {},
	connectionId: "",
	setConnectionId: () => {},
});

export const CreateTemplateFormContextProvider = ({ children, ...props }: PropsWithChildren) => {
	const [connectionId, setConnectionId] = useState("");
	const [skills, setSkills] = useState<Skill[]>([]);
	const contextValue: ICreateTemplateFormContext = {
		skills,
		setSkills,
		connectionId,
		setConnectionId,
	};
	return (
		<CreateTemplateFormContext.Provider value={contextValue}>
			{children}
		</CreateTemplateFormContext.Provider>
	);
};
