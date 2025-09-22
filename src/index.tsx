import React from "react";
import App from "./App";
import "primeflex/primeflex.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
	// @ts-expect-error
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
