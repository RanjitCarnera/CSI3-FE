import React from "react";

export interface PrivateRouteDefinition {
    path: string
    element?: React.ReactNode | null;
    requiredRoles?: string[]
}
