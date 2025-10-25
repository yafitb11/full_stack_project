import axios from "axios";
import { Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Tuser } from "../types/userType";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { MdDelete, MdEdit } from "react-icons/md";
import { Pagination } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { searchActions } from "../store/searchSlice";

const ManageUsers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [users, setUsers] = useState<Tuser[]>([]);
    const [spiner, setspiner] = useState<boolean>(false);
    const search = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const currentPage = useSelector((state: TRootState) => state.searchSlice.currentPage);
    const [reload, setReload] = useState<boolean>(false);
    const { user, autoLogIn } = useAuth();

    { !user && autoLogIn(); }

    const token = localStorage.getItem("token");
    useEffect(() => {
        const getUsers = async () => {
            try {
                setspiner(true)
                axios.defaults.headers.common["x-auth-token"] = token;
                const response = await axios.get("https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",);
                setUsers(response.data);

            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("something's wrong");
            } finally { setspiner(false) }
        };
        getUsers();
    }, [reload]);


    const filterUsers = () => {
        if (users) {
            return users.filter(
                (user) =>
                    user.name.first.toLowerCase().includes(search.toLowerCase()) ||
                    user.name.middle?.toLowerCase().includes(search.toLowerCase()) ||
                    user.name.last.toLowerCase().includes(search.toLowerCase()) ||
                    user._id.toLowerCase().includes(search.toLowerCase()),
            );
        }
        return users;
    }


    const filterByPage = () => {
        const start = (currentPage - 1) * 12;
        const end = start + 12;
        return filterUsers().slice(start, end);
    }

    const deleteUser = async (id: string) => {
        try {
            axios.defaults.headers.common["x-auth-token"] = token;
            const response = await axios.delete(
                `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${id}`);

            if (response.status === 200) {
                toast.success("User deleted successfully", { autoClose: 2000, });
            }

        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("something went wrong", { autoClose: 2000, });
        }
        setReload((reload => !reload));
    };

    const changeBussinessStatus = async (id: string) => {
        try {
            axios.defaults.headers.common["x-auth-token"] = token;
            const response = await axios.patch(
                `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${id}`);

            if (response.status === 200) {
                toast.success("Bussiness Status changed successfully", { autoClose: 2000, });
            }
        } catch (error) {
            console.error("Error changing status:", error);
            toast.error("something went wrong", { autoClose: 2000, });
        }
        setReload((reload => !reload));
    }

    return (
        <div className="flex flex-col items-center justify-start gap-2 bg-blue-300 dark:bg-slate-400">
            <h1 className="text-3xl m-3">All Users</h1>

            <div className="w-[100%] flex gap-6 flex-wrap p-5 justify-center  bg-blue-100 dark:bg-slate-800">
                {users && filterByPage()?.map((user) => {
                    return (
                        <Card key={user._id} id={user._id} className="usersCard" imgSrc={user.image.url}>
                            <div>
                                <h2>{user.name.first} {user.name.middle} {user.name.last}</h2>
                                <p>ID: {user._id}</p>
                                <p> Phone: {user.phone} </p>
                                <p> Email: {user.email} </p>
                                <p> Adress: {user.address.state} {user.address.country} {user.address.city} {user.address.street} {user.address.houseNumber}</p>
                                <p> isBusiness: {user.isBusiness ? "yes" : "no"}</p>
                                <p> isAdmin: {user.isAdmin ? "yes" : "no"}</p>
                            </div>
                            <div className="flex justify-center" id="iconsdiv">
                                <MdEdit className="cursor-pointer text-2xl dark:hover:text-white" onClick={() => navigate("/edit-user/" + user._id)}></MdEdit>
                                <MdDelete className="cursor-pointer text-2xl dark:hover:text-white" onClick={() => { deleteUser(user._id) }}></MdDelete>
                                <button className="font-bold cursor-pointer dark:hover:text-white" onClick={() => { changeBussinessStatus(user._id) }}>isBis</button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {spiner && (
                <Spinner color="purple" aria-label="Purple spinner example" />
            )}
            <div className="flex overflow-x-auto sm:justify-center mb-3">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(filterUsers().length / 12)} onPageChange={(page) => dispatch(searchActions.setCurrentPage(page))} />
            </div>

        </div>
    );
};

export default ManageUsers;







