import { createContext, type PropsWithChildren, type SetStateAction, useState } from "react";

export interface ISettingsTagsContext {
	name: string;
	setName: React.Dispatch<SetStateAction<string>>;
}

export const SettingsTagsContext = createContext<ISettingsTagsContext>({
	name: "",
	setName: () => {},
});

export const SettingsTagsContextProvider = ({ children }: PropsWithChildren) => {
	const [name, setName] = useState("");
	return (
		<SettingsTagsContext.Provider
			value={{
				name,
				setName,
			}}
		>
			{children}
		</SettingsTagsContext.Provider>
	);
};
