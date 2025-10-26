
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/Error";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RouteGuard from "./components/Routguard";
import Favorites from "./pages/Favorites";
import ProductDetails from "./pages/ProductDetails";
import ManageUsers from "./pages/ManageUsers";
import MyOrders from "./pages/MyOrders";
import EditUser from "./pages/EditUser";
import About from "./pages/About";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import ShoppingCart from "./pages/ShoppingCart";
import Contact from "./pages/Contact";
import CreateProduct from "./pages/CreateProduct";
import CreateCategory from "./pages/CreateCategory";
import EditProduct from "./pages/EditProduct";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <Header></Header>

      <Routes>
        <Route path="/" element={<ErrorBoundary>
          <Home />
        </ErrorBoundary>} ></Route>

        <Route path="/home" element={<Home />}></Route>

        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>

        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route path="/categories" element={<Categories />}></Route>
        <Route path="/categories/:categoryId" element={<CategoryProducts />}></Route>

        <Route path="/product/:id" element={<ProductDetails />}></Route>

        <Route path="/cart" element={<RouteGuard>
          <ShoppingCart />
        </RouteGuard>}></Route>

        <Route path="/profile" element={<RouteGuard>
          <Profile />
        </RouteGuard>}></Route>

        <Route path="/favorites" element={<RouteGuard>
          <Favorites />
        </RouteGuard>}></Route>

        <Route path="/my-orders" element={<RouteGuard>
          <MyOrders />
        </RouteGuard>}></Route>

        <Route path="/all-users" element={<RouteGuard isAdmin={true}>
          <ManageUsers />
        </RouteGuard>}></Route>

        <Route path="/edit-user/:id" element={<RouteGuard isAdmin={true}>
          <EditUser />
        </RouteGuard>}></Route>

        <Route path="/create-product" element={<RouteGuard isAdmin={true}>
          <CreateProduct />
        </RouteGuard>}></Route>

        <Route path="/create-category" element={<RouteGuard isAdmin={true}>
          <CreateCategory />
        </RouteGuard>}></Route>

        <Route path="/edit-product/:id" element={<RouteGuard isAdmin={true}>
          <EditProduct />
        </RouteGuard>}></Route>

        <Route path="/*" element={<ErrorPage />} />
      </Routes>

      <Footer></Footer>
    </>
  );
}

export default App;
