import React, {useEffect, useState} from "react";
import graphql from "babel-plugin-relay/macro";
import {useMutation} from "react-relay";
import {TkMessage} from "../../components/ui/TkMessage";
import {NavLink, useMatch} from "react-router-dom";
import {ActivateScreen_ActivateMutation} from "../../__generated__/ActivateScreen_ActivateMutation.graphql";
import {Loader} from "../../components/ui/Loader";
import {TkButtonLink} from "../../components/ui/TkButtonLink";
import {AuthScreenBase} from "../../components/ui/AuthScreenBase";

const REGISTRATION_MUTATION = graphql`
    mutation ActivateScreen_ActivateMutation($input: ActivateUserInput!){
        Auth{
            activateUser(input: $input) {
                clientMutationId
            }
        }
    }
`;

export const ACTIVATION_PATH = "/activate/:token";
type ActivationState = "unknown" | "succeeded" | "error"

export const ActivateScreen = () => {
    const [activate, isActivating] = useMutation<ActivateScreen_ActivateMutation>(REGISTRATION_MUTATION)
    const [state, setState] = useState<ActivationState>("unknown")

    const match = useMatch(ACTIVATION_PATH);
    const token = match?.params.token

    useEffect(() => {
        if (token) {
            activate({
                variables: {input: {token: token}},
                onCompleted: () => setState("succeeded"),
                onError: () => setState("error")
            })
        }
        // eslint-disable-next-line
    }, [])

    return <AuthScreenBase>
        <div className="pl-6 pr-6 pb-4">
            <h1 className="text-center mb-6 text">Activating account ...</h1>

            {isActivating ? <div>
                <Loader/>
            </div> : <div className="w-12">
                {state === "succeeded" &&
                    <TkMessage className="w-12" severity={"success"} content={<div className="flex flex-column p-3">
                        <div>Your account has been successfully activated.</div>
                        <NavLink className="mt-3" to={"/login"}>
                            <TkButtonLink className="w-12" label={"Login to your new account..."}/>
                        </NavLink>
                    </div>}>
                    </TkMessage>}
                {state === "error" && <TkMessage className="w-12" severity={"error"} content={<>
                    Your account could not be activated. Please check the link you followed.
                </>}>
                </TkMessage>}

            </div>}
        </div>
    </AuthScreenBase>
}
