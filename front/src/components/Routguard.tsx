import { Navigate, useLocation, useParams } from "react-router-dom";
import { ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import PleaseLogin from "./PleaseLogin";

type RouteGuardProps = {
    children: ReactNode;
    isAdmin?: boolean;
    allowOwnUser?: boolean;
};

const RouteGuard = ({ children, isAdmin, allowOwnUser }: RouteGuardProps) => {
    const { user } = useAuth();
    const location = useLocation();
    const { id } = useParams();


    if (!user) {
        return <PleaseLogin from={location} />;
    }

    if (isAdmin && !user.isAdmin) {
        return <Navigate to="/" replace state={{ error: "This page is only accessible to administrators" }} />;
    }


    if (allowOwnUser && id && user._id) {
        if (id !== user._id && !user.isAdmin) return <Navigate to="/" replace state={{ error: "You can only access your own profile" }} />;
    }

    return <>{children}</>;
};

export default RouteGuard;
