import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextInput, Label } from "flowbite-react";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/addToCart";
import { useSelector, useDispatch } from "react-redux";
import { TRootState } from "../store/store";
import { cartActions } from "../store/cartSlice";
import axios from "axios";

const ShoppingCart = () => {
    const [loading, setLoading] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: ""
    });
    const { user } = useAuth();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: TRootState) => state.cartSlice.items);
    const totalItems = useSelector((state: TRootState) => state.cartSlice.totalItems);
    const totalPrice = useSelector((state: TRootState) => state.cartSlice.totalPrice);

    const { removeFromCart, updateQuantity, clearCart } = useAddToCart();

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch(cartActions.loadCartFromStorage(parsedCart));
            } catch (error) {
                console.error("Error loading cart from localStorage:", error);
            }
        }
    }, [dispatch]);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error("Please login to checkout");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Validate payment details
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName) {
            toast.error("Please fill in all payment details");
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                products: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                totalPrice: totalPrice,
                paymentDetails: paymentDetails
            };

            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;

            await axios.post("http://localhost:8182/orders", orderData);

            // Clear cart after successful order
            clearCart();
            toast.success("Order placed successfully!");

            // Reset payment form
            setPaymentDetails({
                cardNumber: "",
                expiryDate: "",
                cvv: "",
                cardholderName: ""
            });

        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please Login
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You need to be logged in to view your shopping cart.
                    </p>
                    <Link to="/signin">
                        <Button color="blue">Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (user.isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Admin Access
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Admins cannot use the shopping cart.
                    </p>
                    <Link to="/">
                        <Button color="blue">Back to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                            Your cart is empty
                        </p>
                        <Link to="/">
                            <Button color="blue">Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.product._id} className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.product.image.url}
                                            alt={item.product.image.alt}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {item.product.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                ${item.product.price}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                color="gray"
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                            >
                                                <FaMinus />
                                            </Button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                color="gray"
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                            <Button
                                                size="sm"
                                                color="failure"
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="mt-2"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary & Checkout */}
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Order Summary
                                </h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Payment Form */}
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Payment Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <TextInput
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiryDate">Expiry Date</Label>
                                            <TextInput
                                                id="expiryDate"
                                                placeholder="MM/YY"
                                                value={paymentDetails.expiryDate}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="cvv">CVV</Label>
                                            <TextInput
                                                id="cvv"
                                                placeholder="123"
                                                value={paymentDetails.cvv}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                                        <TextInput
                                            id="cardholderName"
                                            placeholder="John Doe"
                                            value={paymentDetails.cardholderName}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        color="blue"
                                        className="w-full"
                                        onClick={handleCheckout}
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Place Order"}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;
