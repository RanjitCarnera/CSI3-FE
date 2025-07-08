import { Observable } from "relay-runtime";
import { ReduxStore } from "../Store";
import { selectCurrentAccountId } from "../redux/AuthSlice";
import { createClient } from "graphql-ws";
import { SubscribeFunction } from "react-relay-network-modern";

export const WSSubscription: SubscribeFunction = (operation, variables) => {
	return Observable.create((sink) => {
		if (!operation.text) {
			return sink.error(new Error("Operation text cannot be empty"));
		}

		const loginData = ReduxStore.getState().auth.loginData;
		const accountId = selectCurrentAccountId(ReduxStore.getState());

		const subscriptionClient = createClient({
			url: `${process.env.REACT_APP_WS_API_BASE}/api/graphql/ws?token=${loginData?.accessToken}&accountId=${accountId}`,
			retryAttempts: 3,
			keepAlive: 10000,
			lazy: true,
		});

		return subscriptionClient.subscribe(
			{
				operationName: operation.name,
				query: operation.text,
				variables,
			},
			{
				...sink,
				error: (err: any) => {
					if (Array.isArray(err))
						// GraphQLError[]
						return sink.error(new Error(err.map(({ message }) => message).join(", ")));

					if (err instanceof CloseEvent)
						return sink.error(
							new Error(
								`Socket closed with event ${err.code} ${err.reason || ""}`, // reason will be available on clean closes only
							),
						);

					return sink.error(err);
				},
			},
		);
	}) as any;
};
