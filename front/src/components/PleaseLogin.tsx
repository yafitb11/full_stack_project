import { Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";

type PleaseLoginProps = {
    from?: Location;
    // message?: string;
};
//const PleaseLogin = ({ from, message }: PleaseLoginProps) => {
//  {message || "You are not logged in, please log in to view this page."}
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
                    <Button color="blue">Login</Button>
                </Link>
            </div>
        </div>
    );
}

export default PleaseLogin;