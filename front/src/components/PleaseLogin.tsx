import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const PleaseLogin = () => {
    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1>
                    Please Login
                </h1>
                <p>
                    You need to be logged in to view your shopping cart.
                </p>
                <Link to="/signin">
                    <Button color="blue">Login</Button>
                </Link>
            </div>
        </div>
    );
}

export default PleaseLogin;