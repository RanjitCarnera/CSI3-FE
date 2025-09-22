import { z } from "zod";

export type EnumObject<T extends string> = {
	[K in T]: string;
};
const zodEnum = <T>(arr: T[]): [T, ...T[]] => arr as [T, ...T[]];

class ZodEnumFactory {
	create<T extends string>(map: EnumObject<T>): z.ZodEnum<[T, ...T[]]> {
		const Enum = Object.keys(map) as T[];
		const formSchema = z.enum(zodEnum(Enum));
		return formSchema as z.ZodEnum<[T, ...T[]]>;
	}
}

export const zodEnumFactory = new ZodEnumFactory();
