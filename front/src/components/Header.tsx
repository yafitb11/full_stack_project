import { DarkThemeToggle, Navbar, TextInput, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userSlice";
import { searchActions } from "../store/searchSlice";
import { IoSearchSharp, IoPersonSharp, IoCartSharp, IoMenuSharp } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    dispatch(userActions.logout());
    localStorage.setItem("token", "");
    navigate("/");
  };

  return (
    <div className="bg-slate-800 dark:bg-slate-900">
      {/* Desktop Header - 2 rows */}
      <div className="hidden md:block">
        {/* Top row - Logo, Search, Profile, Cart */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-2xl font-semibold text-white hover:text-cyan-700">
            E-Shop
          </Link>

          <div className="flex items-center space-x-4">
            <DarkThemeToggle />
            <TextInput
              rightIcon={IoSearchSharp}
              type="search"
              placeholder="Search products..."
              className="w-80"
              onChange={(e) => dispatch(searchActions.setSearchWord(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-white hover:text-cyan-700">
              <IoPersonSharp className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="text-white hover:text-cyan-700">
              <IoCartSharp className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Bottom row - Navigation links */}
        <div className="flex items-center justify-center space-x-8 px-4 py-2 border-t border-slate-700">
          <Link to="/" className="text-white hover:text-cyan-700">Home</Link>

          <Dropdown label="Categories" className="text-white hover:text-cyan-700">
            {categories.map((category: any) => (
              <Dropdown.Item key={category._id}>
                <Link to={`/categories/${category._id}`}>{category.name}</Link>
              </Dropdown.Item>
            ))}
          </Dropdown>

          {!user && (
            <>
              <Link to="/signin" className="text-white hover:text-cyan-700">Login</Link>
              <Link to="/register" className="text-white hover:text-cyan-700">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" className="text-white hover:text-cyan-700">Profile</Link>
              <Link to="/my-orders" className="text-white hover:text-cyan-700">My Orders</Link>
              <Link to="/favorites" className="text-white hover:text-cyan-700">My Favorites</Link>
            </>
          )}

          {user && user.isAdmin && (
            <Link to="/all-users" className="text-white hover:text-cyan-700">All Users</Link>
          )}

          <Link to="/about" className="text-white hover:text-cyan-700">About</Link>
          <Link to="/contact" className="text-white hover:text-cyan-700">Contact</Link>

          {user && (
            <button onClick={handleLogout} className="text-white hover:text-cyan-700">
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Mobile Header - Single row */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-cyan-700"
        >
          <IoMenuSharp className="w-6 h-6" />
        </button>

        <Link to="/" className="text-xl font-semibold text-white hover:text-cyan-700">
          E-Shop
        </Link>

        <div className="flex items-center space-x-4">
          <IoSearchSharp className="w-6 h-6 text-white" />
          <Link to="/profile" className="text-white hover:text-cyan-700">
            <IoPersonSharp className="w-6 h-6" />
          </Link>
          <Link to="/cart" className="text-white hover:text-cyan-700">
            <IoCartSharp className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-700 px-4 py-2 space-y-2">
          <Link to="/" className="block text-white hover:text-cyan-700 py-1">Home</Link>

          <div className="text-white py-1">Categories:</div>
          {categories.map((category: any) => (
            <Link
              key={category._id}
              to={`/categories/${category._id}`}
              className="block text-white hover:text-cyan-700 py-1 pl-4"
            >
              {category.name}
            </Link>
          ))}

          {!user && (
            <>
              <Link to="/signin" className="block text-white hover:text-cyan-700 py-1">Login</Link>
              <Link to="/register" className="block text-white hover:text-cyan-700 py-1">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" className="block text-white hover:text-cyan-700 py-1">Profile</Link>
              <Link to="/my-orders" className="block text-white hover:text-cyan-700 py-1">My Orders</Link>
              <Link to="/favorites" className="block text-white hover:text-cyan-700 py-1">My Favorites</Link>
            </>
          )}

          {user && user.isAdmin && (
            <Link to="/all-users" className="block text-white hover:text-cyan-700 py-1">All Users</Link>
          )}

          <Link to="/about" className="block text-white hover:text-cyan-700 py-1">About</Link>
          <Link to="/contact" className="block text-white hover:text-cyan-700 py-1">Contact</Link>

          {user && (
            <button onClick={handleLogout} className="block text-white hover:text-cyan-700 py-1">
              Sign Out
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;