//import axios from "axios";
import { Card, Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Tuser } from "../types/types";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { MdDelete, MdEdit } from "react-icons/md";
import { Pagination } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchActions } from "../store/searchSlice";
import useAuth from "../hooks/useAuth";
import api from "../api/api";

const ManageUsers = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [users, setUsers] = useState<Tuser[]>([]);
    const [spiner, setspiner] = useState<boolean>(false);
    const search = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const currentPage = useSelector((state: TRootState) => state.searchSlice.currentPage);
    const [reload, setReload] = useState<boolean>(false);

    //const token = localStorage.getItem("token");
    useEffect(() => {
        const getUsers = async () => {
            try {
                setspiner(true)
                //  axios.defaults.headers.common["x-auth-token"] = token;
                const response = await api.get("/users",);
                setUsers(response.data);

            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("something's wrong");
            } finally { setspiner(false) }
        };
        getUsers();
    }, [reload]);


    const filteredUsers = useMemo(() => {
        if (!users) return [];

        const searchLower = search.toLowerCase();

        return users.filter((u) =>
            u.name.first.toLowerCase().includes(searchLower) ||
            u.name.middle?.toLowerCase().includes(searchLower) ||
            u.name.last.toLowerCase().includes(searchLower) ||
            u._id.toLowerCase().includes(searchLower)
        );
    }, [users, search]);

    const pagedUsers = useMemo(() => {
        const start = (currentPage - 1) * 12;
        return filteredUsers.slice(start, start + 12);
    }, [filteredUsers, currentPage]);

    const deleteUser = async (id: string) => {
        try {
            //  axios.defaults.headers.common["x-auth-token"] = token;
            const response = await api.delete(
                `/users/${id}`);

            if (response.status === 200) {
                toast.success("User deleted successfully", { autoClose: 2000, });
            }

        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("something went wrong", { autoClose: 2000, });
        }
        setReload((reload => !reload));
    };

    if (!user || !user.isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    You must be the Admin to watch this Page!
                </h1>
            </div>
        );
    }

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1>All Users</h1>
                <p>Review and manage every registered user in the system</p>
            </div>

            {spiner && (
                <div className="text-center w-full mb-6">
                    <Spinner color="purple" aria-label="Purple spinner example" />
                </div>
            )}

            <div className="pageCardsDiv">
                {pagedUsers.map((user) => {
                    return (
                        <Card key={user._id} className="mycard">
                            <div className="imageDiv">
                                <img
                                    src={user.image.url}
                                    alt={`${user.name.first} ${user.name.last}`}
                                />
                            </div>
                            <div className="textDiv">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-2">
                                    {user.name.first} {user.name.middle} {user.name.last}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">ID: {user._id}</p>
                                <p className="text-gray-600 dark:text-gray-300">Phone: {user.phone}</p>
                                <p className="text-gray-600 dark:text-gray-300">Email: {user.email}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Address: {user.address.state} {user.address.country} {user.address.city} {user.address.street} {user.address.houseNumber}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Role: {user.isAdmin ? "Admin" : "User"}</p>
                            </div>
                            <div className="cardButtonsDiv">
                                <div className="flex space-x-2">
                                    <MdEdit
                                        className="text-black dark:text-white cursor-pointer text-2xl hover:text-green-500 dark:hover:text-green-500"
                                        onClick={() => navigate(`/edit-user/${user._id}`)}
                                        title="Edit user"
                                    />
                                    <MdDelete
                                        className="text-black dark:text-white cursor-pointer text-xl hover:text-red-600 dark:hover:text-red-600"
                                        onClick={() => { deleteUser(user._id) }}
                                        title="Delete user"
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="flex overflow-x-auto justify-center mt-8">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredUsers.length / 12)} onPageChange={(page) => dispatch(searchActions.setCurrentPage(page))} />
            </div>
        </div>
    );
};

export default ManageUsers;







