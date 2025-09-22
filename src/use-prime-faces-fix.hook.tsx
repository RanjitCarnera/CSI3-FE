import { useEffect } from "react";

export const usePrimeFacesFix = () => {
	// https://github.com/primefaces/primereact/issues/4523#issuecomment-1602749975
	// Unclear on github releases when PR referencing 4523 was released. Otherwise update primefaces.
	useEffect(() => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(({ addedNodes, removedNodes }) => {
				addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						// Check if it's an HTML element node
						const htmlElementNode = node as HTMLElement;
						if (htmlElementNode.classList.contains("p-checkbox-icon")) {
							// Perform your logic here
							htmlElementNode.addEventListener("click", stopPropagationEventCallback);
						}
					}
				});
				removedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						// Check if it's an HTML element node
						const htmlElementNode = node as HTMLElement;
						if (htmlElementNode.classList.contains("p-checkbox-icon")) {
							// Perform your logic here
							htmlElementNode.removeEventListener(
								"click",
								stopPropagationEventCallback,
							);
						}
					}
				});
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });

		// Cleanup observer on component unmount
		return () => {
			observer.disconnect();
		};
	}, []);

	function stopPropagationEventCallback(e: MouseEvent) {
		e.stopImmediatePropagation();
		// @ts-expect-error
		const parentOpt = e.target?.parentElement as HTMLElement | undefined;

		if (parentOpt?.classList.contains("p-checkbox-box")) {
			parentOpt?.click?.();
		} else if (!!parentOpt && parentOpt?.tagName !== "div") {
			const grandParentOpt = parentOpt.parentElement;
			grandParentOpt?.click?.();
		}
	}

	return null;
};
