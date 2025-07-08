import {
	errorMiddleware,
	loggerMiddleware,
	perfMiddleware,
	RelayNetworkLayer,
	retryMiddleware,
	uploadMiddleware,
	urlMiddleware,
} from "react-relay-network-modern";
import { toast } from "react-toastify";
import { RecordSource, Store } from "relay-runtime";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { ErrorHandlingMiddleware } from "./network/ErrorHandlingMiddleware";
import { JwtMiddleware } from "./network/JwtMiddleware";
import { WSSubscription } from "./network/WSSubscription";

// Export a singleton instance of Relay Environment configured with our network function:
const relayStore = new Store(new RecordSource());

const isDev = process.env.NODE_ENV === "development";
const network = new RelayNetworkLayer(
	[
		urlMiddleware({
			url: async () => `${process.env.REACT_APP_API_BASE}/api/graphql`,
		}),
		isDev ? loggerMiddleware() : null,
		isDev ? errorMiddleware() : null,
		isDev ? perfMiddleware() : null,
		retryMiddleware({
			fetchTimeout: 60000,
			retryDelays: (attempt) => Math.pow(2, attempt + 4) * 100 + 3200, // or simple array [6400, 9600, 16000],
			beforeRetry: ({ abort, attempt }) => {
				if (attempt > 3) {
					abort();
					toast.error(
						"Couldn't make connection with API - please wait a few minutes and check your internet connection.",
					);
				}
			},
			statusCodes: [500, 503, 504],
		}),
		JwtMiddleware,
		uploadMiddleware(),
		ErrorHandlingMiddleware,
	],
	{
		subscribeFn: WSSubscription,
	},
);

export const RelayEnvironment = new RelayModernEnvironment({
	network,
	store: relayStore,
});
