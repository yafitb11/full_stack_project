import { Button, Card } from "flowbite-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const moveToEditProfilePage = () => {
        navigate(`/edit-user/${user?._id}`);
    };


    if (user) {
        return (
            <div className="pageDiv">
                <div className="pageTextAndButtonsDiv">
                    <h1 className="text-3xl">My Profile</h1>
                    <p className="!text-2xl">Welcome {user.name.first}!</p>
                </div>
                <div className="w-[100%] flex gap-3 flex-col mt-3 items-center justify-center">
                    <Card className="mycard">
                        <div className="imageDiv !h-[160px]">
                            <img
                                src={user.image.url}
                                alt={user.image.alt}
                            />
                        </div>
                        <div className="textDiv !py-5">
                            <p>Name: {user.name.first} {user.name.middle} {user.name.last}</p>
                            <p className="my-2">Phone: {user.phone}</p>
                            <p>Email: {user.email}</p>
                            <p className="my-2">Address: {user.address.state} {user.address.country} {user.address.city} {user.address.street} {user.address.houseNumber}</p>
                        </div>
                    </Card>

                    <Button color="blue" className="mt-3 dark:!bg-slate-800 dark:text-slate-200 dark:!border-white" onClick={moveToEditProfilePage}>Edit your details</Button>
                </div>
            </div>
        );
    };
}

export default Profile;