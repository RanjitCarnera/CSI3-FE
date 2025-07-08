import {TkCard} from "./TkCard";
import React, {ReactNode} from "react";
import {NavLink} from "react-router-dom";
import styled from "styled-components";
import TeambuilderLogo from "../../assets/teambuilder-logo-horizontal.png"
import {ProfileLink} from "../relay/ProfileLink";
import {FeedbackLink} from "./FeedbackLink";
import {graphql} from "babel-plugin-relay/macro";
import {useFragment} from "react-relay";
import {BaseHeader_LogoFragment$key} from "../../__generated__/BaseHeader_LogoFragment.graphql";

const FRAGMENT = graphql`
    fragment BaseHeader_LogoFragment on File {
        url
    }
`

interface OwnProps {
    queryFragmentRef?: BaseHeader_LogoFragment$key
    className?: string
    children?: ReactNode
}

export const BaseHeader = ({queryFragmentRef, className, children}: OwnProps) => {
    const logo = useFragment<BaseHeader_LogoFragment$key>(FRAGMENT, queryFragmentRef || null)

    return <div className={className}>
        <TkCard className="card-flat">
            <div className="flex align-items-center">
                <div className="mr-5">
                    <NavLink to={"/"}>
                        <Logo src={logo?.url || TeambuilderLogo}/>
                    </NavLink>
                </div>
                <div className="flex flex-grow-1 hide-print">
                    {children}
                </div>

                <div className="ml-5 flex justify-content-end hide-print">
                    <FeedbackLink className="mr-2"/>
                    <ProfileLink/>
                </div>
            </div>

        </TkCard>
    </div>

}

const Logo = styled.img`
  max-width: 150px;
`
