import { type RuleSet } from "styled-components";

export class Typography {
	constructor(protected readonly css: RuleSet<object>) {}

	public getCSS(): RuleSet<object> {
		return this.css;
	}
}
