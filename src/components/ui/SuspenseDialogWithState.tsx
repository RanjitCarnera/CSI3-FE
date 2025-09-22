import { type FormikProps } from "formik/dist/types";
import React, { type MutableRefObject, type ReactNode, Suspense, useRef } from "react";
import { TkButtonLink } from "./TkButtonLink";
import { TkDialog } from "./TkDialog";

interface OwnProps<FormState, Ext extends {} = {}> {
	title: string | ReactNode;
	isVisible: boolean;
	onHide: () => void;
	affirmativeText?: string;

	formComponent: (
		state: MutableRefObject<(FormikProps<FormState> & Ext) | null>,
		onHide: () => void,
	) => ReactNode;
}

export function SuspenseDialogWithState<FormState, Ext extends {} = {}>({
	title,
	isVisible,
	onHide,
	affirmativeText,
	formComponent,
}: OwnProps<FormState, Ext>) {
	const formik = useRef<FormikProps<FormState>>();

	return (
		<TkDialog
			dismissableMask={true}
			header={typeof title === "string" ? <h1>{title}</h1> : title}
			visible={isVisible}
			onHide={onHide}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.current?.isSubmitting}
						type="button"
						onClick={onHide}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.current?.isSubmitting}
						onClick={() => formik.current?.handleSubmit()}
						label={
							formik.current?.isSubmitting ? "Working..." : affirmativeText || "Save"
						}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<Suspense fallback={<div>Loading...</div>}>
				{formComponent(formik as any, onHide)}
			</Suspense>
		</TkDialog>
	);
}
