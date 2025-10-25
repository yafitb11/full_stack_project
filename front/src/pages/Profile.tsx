import { Button, Card } from "flowbite-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, autoLogIn } = useAuth();
    const navigate = useNavigate();
    const moveToEditProfilePage = () => { navigate('/edit-profile'); }
    { !user && autoLogIn(); }

    return (
        <div className="pt-2 flex flex-col items-center gap-2  bg-blue-300 dark:bg-slate-400">
            <h1 className="text-3xl">My Profile</h1>
            <p className="text-xl">Welcome {user?.name.first}!</p>
            <div className="w-[100%] flex gap-3 flex-col p-5 items-center justify-center bg-blue-100 dark:bg-slate-800">
                {user && <Card className="usersCard" imgSrc={user.image.url}>

                    <p>Name: {user.name.first} {user.name.middle} {user.name.last}</p>
                    <p> Phone: {user.phone} </p>
                    <p> Email: {user.email} </p>
                    <p> Adress: {user.address.state} {user.address.country} {user.address.city} {user.address.street} {user.address.houseNumber}</p>
                    <p> isBusiness: {user.isBusiness ? "yes" : "no"}</p>
                </Card>}

                <Button onClick={moveToEditProfilePage}>Edit your details</Button>
            </div>
        </div>
    );
};

export default Profile;
