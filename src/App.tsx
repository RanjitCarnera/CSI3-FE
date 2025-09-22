import * as Sentry from "@sentry/react";
import { TkComponentsContext } from "@thekeytechnology/framework-react-components";
import "chartjs-plugin-dragdata";
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	SubTitle,
	Title,
	Tooltip,
} from "chart.js";
import React, { Suspense } from "react";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { RelayEnvironmentProvider } from "react-relay";
import { ToastContainer } from "react-toastify";
import { ErrorFallback } from "@components/ui/ErrorFallback";
import { Loader } from "@components/ui/Loader";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { PermissionBasedNavigation } from "./navigation/PermissionBasedNavigation";
import { RelayEnvironment } from "./RelayEnvironment";
import { Routes } from "./routes/Routes";
import { ReduxStore } from "./Store";
import { usePrimeFacesFix } from "./use-prime-faces-fix.hook";

const isProduction = process.env.REACT_APP_APP_ENVIRONMENT === "production";

if (isProduction) {
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY_DSN,
	});
}

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	SubTitle,
	Tooltip,
	Legend,
);

function App() {
	usePrimeFacesFix();
	return (
		<Provider store={ReduxStore}>
			<CookiesProvider>
				<TkComponentsContext.Provider value={HarkinsTheme}>
					<ToastContainer autoClose={5000} newestOnTop={true} />
					<Sentry.ErrorBoundary
						fallback={<ErrorFallback />}
						onError={(e) => {
							console.error(e);
						}}
					>
						<Suspense fallback={<Loader />}>
							<RelayEnvironmentProvider environment={RelayEnvironment}>
								{/* @ts-expect-error */}
								<PermissionBasedNavigation routes={Routes} />
							</RelayEnvironmentProvider>
						</Suspense>
					</Sentry.ErrorBoundary>
				</TkComponentsContext.Provider>
			</CookiesProvider>
		</Provider>
	);
}

export default App;

export interface Tuple<T, K> {
	key: T;
	value: K;
}

declare global {
	interface Array<T> {
		max(): T | undefined;

		min(): T | undefined;

		distinct(): T[];

		distinctBy<K>(key: (i: T) => K): T[];

		groupBy<K>(key: (i: T) => K): Array<Tuple<K, T[]>>;
	}
}

// eslint-disable-next-line no-extend-native
Array.prototype.distinct = function () {
	return this.filter((x, i) => i === this.indexOf(x));
};

// eslint-disable-next-line no-extend-native
Array.prototype.distinctBy = function <T, K>(keyFunction: (i: T) => K) {
	const knownKeys: K[] = [];
	return this.filter((x) => {
		const key = keyFunction(x);
		if (knownKeys.includes(key)) {
			return false;
		} else {
			knownKeys.push(key);
			return true;
		}
	});
};

// eslint-disable-next-line no-extend-native
Array.prototype.groupBy = function <T, K>(keyFunction: (i: T) => K): Array<Tuple<K, T[]>> {
	const groups: Array<Tuple<K, T[]>> = [];

	this.forEach((x) => {
		const keyValue = keyFunction(x);
		const existingGroup = groups.find((g) => g.key === keyValue);
		if (existingGroup) {
			existingGroup.value.push(x);
		} else {
			groups.push({ key: keyValue, value: [x] });
		}
	});
	return groups;
};
// eslint-disable-next-line no-extend-native
Array.prototype.max = function () {
	return Math.max.apply(null, this);
};
// eslint-disable-next-line no-extend-native
Array.prototype.min = function () {
	return Math.min.apply(null, this);
};
