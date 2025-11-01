import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ReactNode } from "react";
import useAuth from "../hooks/useAuth";

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
        return (
            <div className="min-h-[85vh] flex flex-col items-center p-3 gap-2 bg-blue-300 dark:bg-slate-400">
                <h1 className="text-3xl text-center">
                    You are not logged in, please log in.
                </h1>
                <Link
                    to="/login"
                    state={{ from: location }} // שומרים את הנתיב המקורי
                    className="cursor-pointer font-bold text-2xl mt-4"
                >
                    Log in
                </Link>
            </div>
        );
    }

    if (isAdmin && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }


    if (allowOwnUser && id && id !== user._id && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RouteGuard;
