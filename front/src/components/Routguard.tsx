import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import useAuth from "../hooks/useAuth";

type RouteGuardProps = {
    children: ReactNode;
    isBiz?: boolean;
    isAdmin?: boolean;
};

const RouteGuard = (props: RouteGuardProps) => {
    const { children, isBiz, isAdmin } = props;

    const { user, autoLogIn } = useAuth();
    { !user && autoLogIn(); }

    if (!user) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center p-3 gap-2 bg-blue-300 dark:bg-slate-400">
                <h1 className="text-3xl">you are not logged in, please log-in.</h1>
                <Link to="/login" className="cursor-pointer font-bold text-2xl mt-4">log in</Link>
            </div>)
    }

    if (isBiz && !user.isBusiness) {
        return <Navigate to="/" />;
    }
    if (isAdmin && !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};


export default RouteGuard;