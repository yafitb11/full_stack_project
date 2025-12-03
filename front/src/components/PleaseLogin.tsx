import { Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";

type PleaseLoginProps = {
    from?: Location;
};

const PleaseLogin = ({ from }: PleaseLoginProps) => {
    const currentLocation = useLocation();
    const redirectTo = from || currentLocation;

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1>Please Login</h1>
                <p>
                    You are not logged in, please log in to view this page.
                </p>
                <Link to="/signin" state={{ from: redirectTo }}>
                    <Button color="blue" className="m-auto w-[180px] mt-16 dark:!bg-slate-800 dark:text-slate-200 dark:!border-white ">Login</Button>
                </Link>
            </div>
        </div>
    );
}

export default PleaseLogin;