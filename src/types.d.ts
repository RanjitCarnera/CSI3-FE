declare module "*.png";
declare module "*.json";
declare module "*.html";

declare module "babel-plugin-relay/macro";

type Writable<T> = T extends ReadonlyArray<infer U>
	? Array<Writable<U>>
	: T extends {}
	? { -readonly [K in keyof T]: Writable<T[K]> }
	: T;
