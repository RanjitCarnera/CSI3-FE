import React, { type ReactNode } from "react";
import { TkSelectButton } from "@components/ui/TkSelectButton";

export abstract class SelectButtonBuilder<Kind, State, Props extends {} = {}> {
	protected abstract getItemTemplate(state: State): (kind: Kind) => ReactNode;

	protected abstract useState(): (props: Props) => State;

	protected abstract getValue(state: State): Kind | null;

	protected abstract getOptions(state: State): Kind[];

	protected abstract getExtra(state: State): ReactNode;

	protected className: string = "";

	protected abstract getOnChange(state: State): (e?: Kind | null) => void;

	public build() {
		const useState = this.useState();
		return (props: Props) => {
			const state = useState(props);
			const itemTemplate = this.getItemTemplate(state);
			const value = this.getValue(state);
			const options = this.getOptions(state);
			const extra = this.getExtra(state);
			const handleOnChange = this.getOnChange(state);
			return (
				<div className={this.className}>
					{extra}
					<TkSelectButton
						itemTemplate={itemTemplate}
						value={value}
						options={options}
						onChange={(e) => {
							const kind = e.value as Kind | null | undefined;
							handleOnChange(kind);
						}}
					/>
				</div>
			);
		};
	}
}
