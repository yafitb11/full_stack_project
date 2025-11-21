import axios from "axios";
import { Card, Spinner, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Tuser } from "../types/types";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { MdDelete, MdEdit } from "react-icons/md";
import { Pagination } from "flowbite-react";
import { useNavigate } from "react-router-dom";
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

    const token = localStorage.getItem("token");
    useEffect(() => {
        const getUsers = async () => {
            try {
                setspiner(true)
                axios.defaults.headers.common["x-auth-token"] = token;
                const response = await axios.get("http://localhost:8182/users",);
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
                `http://localhost:8182/users/${id}`);

            if (response.status === 200) {
                toast.success("User deleted successfully", { autoClose: 2000, });
            }

        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("something went wrong", { autoClose: 2000, });
        }
        setReload((reload => !reload));
    };



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
                {users && filterByPage()?.map((user) => {
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
                                <Button color="blue" onClick={() => navigate(`/edit-user/${user._id}`)}>
                                    Edit User
                                </Button>
                                <div className="flex space-x-2">
                                    <MdEdit
                                        className="text-black cursor-pointer text-2xl hover:text-green-500"
                                        onClick={() => navigate(`/edit-user/${user._id}`)}
                                        title="Edit user"
                                    />
                                    <MdDelete
                                        className="text-black cursor-pointer text-2xl hover:text-red-600"
                                        onClick={() => { deleteUser(user._id) }}
                                        title="Delete user"
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="flex overflow-x-auto sm:justify-center mt-8">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(filterUsers().length / 12)} onPageChange={(page) => dispatch(searchActions.setCurrentPage(page))} />
            </div>
        </div>
    );
};

export default ManageUsers;







