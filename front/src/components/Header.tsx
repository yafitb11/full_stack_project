import { DarkThemeToggle, Navbar, TextInput, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoSearchSharp, IoPersonSharp, IoCartSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userSlice";
import { searchActions } from "../store/searchSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { TRootState } from "../store/store";
import { cartActions } from "../store/cartSlice";
import { GiShop } from "react-icons/gi";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();

    const totalItems = useSelector((state: TRootState) => state.cartSlice.totalItems);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("http://localhost:8182/categories");
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = () => {
        dispatch(userActions.logout());
        dispatch(cartActions.clearCart());
        localStorage.setItem("token", "");
        navigate("/");
    };


    const renderLinks = () => (
        <>
            <Navbar.Link as={Link} to={"/"} className="text-white hover:text-cyan-700">
                Home
            </Navbar.Link>

            <Dropdown
                label={
                    <Link
                        to="/categories"
                        className="text-white hover:text-cyan-700 cursor-pointer dark:text-gray-400 dark:hover:text-white"
                    >
                        Categories
                    </Link>
                }
                inline
            >
                {categories.map((category: any) => (
                    <Dropdown.Item key={category._id}>
                        <Link to={`/categories/${category._id}`}>{category.title}</Link>
                    </Dropdown.Item>
                ))}
            </Dropdown>

            {!user && (
                <>
                    <Navbar.Link as={Link} to={"/signin"} className="text-white hover:text-cyan-700">
                        Login
                    </Navbar.Link>
                    <Navbar.Link as={Link} to={"/register"} className="text-white hover:text-cyan-700">
                        Register
                    </Navbar.Link>
                </>
            )}

            {user && (
                <>
                    <Navbar.Link as={Link} to={"/profile"} className="text-white hover:text-cyan-700">
                        Profile
                    </Navbar.Link>
                </>)}

            {user && !user.isAdmin && (
                <>
                    <Navbar.Link as={Link} to={"/my-orders"} className="text-white hover:text-cyan-700">
                        My Orders
                    </Navbar.Link>
                    <Navbar.Link as={Link} to={"/favorites"} className="text-white hover:text-cyan-700">
                        My Favorites
                    </Navbar.Link>
                </>
            )}

            {user && user.isAdmin && (
                <>
                    <Navbar.Link as={Link} to={"/all-users"} className="text-white hover:text-cyan-700">
                        All Users
                    </Navbar.Link>

                    <Navbar.Link as={Link} to={"/contactmessages"} className="text-white hover:text-cyan-700">
                        Contact Messages
                    </Navbar.Link>

                    <Navbar.Link as={Link} to={"/products-management"} className="text-white hover:text-cyan-700">
                        Products Management
                    </Navbar.Link>
                </>
            )}

            <Navbar.Link as={Link} to={"/about"} className="text-white hover:text-cyan-700">
                About
            </Navbar.Link>

            {!user?.isAdmin && (
                <Navbar.Link as={Link} to={"/contact"} className="text-white hover:text-cyan-700">
                    Contact
                </Navbar.Link>
            )}

            {user && (
                <Navbar.Link
                    className="cursor-pointer text-white hover:text-cyan-700"
                    onClick={handleLogout}
                >
                    Sign Out
                </Navbar.Link>
            )}
        </>
    );

    return (
        <div className="bg-slate-500 dark:bg-slate-900">
            <Navbar
                fluid
                className="!px-5 xs:pb-1 bg-slate-500 dark:bg-slate-900 border-b border-slate-700"
            >
                {/* לוגו */}
                <Navbar.Brand as={Link} to={"/"} className="text-white hover:text-cyan-400 dark:hover:text-cyan-500">
                    <GiShop size={32} className="mr-1" />
                    <span className="self-center whitespace-nowrap text-2xl font-bold hover:text-cyan-400 dark:hover:text-cyan-500">
                        E-SHOP
                    </span>
                </Navbar.Brand>

                <Navbar.Brand className="flex items-center gap-2 xs:w-[60%]">
                    <DarkThemeToggle className="mr-2 text-white hover:text-slate-500" />
                    <TextInput
                        rightIcon={IoSearchSharp}
                        type="search"
                        placeholder="Search..."
                        onChange={(e) => dispatch(searchActions.setSearchWord(e.target.value))}
                    />
                </Navbar.Brand>

                <div className="flex items-center justify-center gap-5 xs:w-[100%] xs:mt-1 ">
                    <Link to="/profile" className="text-white hover:text-cyan-400 dark:hover:text-cyan-500">
                        <IoPersonSharp className="w-7 h-7" />
                    </Link>

                    <Link to="/cart" className="text-white hover:text-cyan-400 dark:hover:text-cyan-500 relative">
                        <IoCartSharp className="w-7 h-7" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <Navbar.Toggle className="text-white hover:text-slate-500 dark:text-white dark:hover:text-gray-400" />
                </div>

                <Navbar.Collapse className="md:hidden">
                    {renderLinks()}
                </Navbar.Collapse>
            </Navbar>


            <Navbar
                fluid
                rounded
                className="hidden md:flex bg-slate-400 dark:bg-slate-800 justify-center"
            >
                <Navbar.Collapse className="flex justify-center space-x-8 text-center">
                    {renderLinks()}
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default Header;