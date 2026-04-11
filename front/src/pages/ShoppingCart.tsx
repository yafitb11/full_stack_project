import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, TextInput, Label } from "flowbite-react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/useAddToCart";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { paymentSchema } from "../validations/newOrderPayment.joi";
import { PaymentDetails } from "../types/moreTypes";
import PleaseLogin from "../components/PleaseLogin";
//import axios from "axios";
import api from "../api/api";

// partial components
const CartItem = ({ item, updateQuantity, removeFromCart }: any) => (
    <Card className="p-4 dark:bg-slate-800">
        <div className="flex items-center md:space-x-4 xs:flex-col xs:gap-2">
            <img src={item.product.image.url} alt={item.product.image.alt} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
                <h3 className="text-lg font-semibold dark:text-white">{item.product.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">${item.product.price}</p>
            </div>
            <div className="flex items-center space-x-2">
                <Button size="sm" color="gray" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}><FaMinus /></Button>
                <span className="w-12 text-center dark:text-gray-300">{item.quantity}</span>
                <Button size="sm" color="gray" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}><FaPlus /></Button>
            </div>
            <div className="md:!ml-7">
                <p className="text-lg font-semibold dark:text-white mb-2">${(item.product.price * item.quantity).toFixed(2)}</p>
                <Button size="sm" onClick={() => removeFromCart(item.product._id)} className="mt-2 m-auto !bg-red-500 hover:!bg-red-600 dark:!bg-red-800 dark:hover:!bg-red-700"><FaTrash /></Button>
            </div>
        </div>
    </Card>
);

const CartSummary = ({ totalPrice }: any) => (
    <Card className="p-6 dark:bg-slate-800">
        <h2 className="text-xl font-bold dark:text-white mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
            <div className="flex justify-between dark:text-gray-300"><span>Subtotal:</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between dark:text-gray-300"><span>Tax:</span><span>$0.00</span></div>
            <div className="flex justify-between font-bold text-lg dark:text-gray-100"><span>Total:</span><span>${totalPrice.toFixed(2)}</span></div>
        </div>
    </Card>
);

const PaymentForm = ({ register, handleSubmit, errors, loading, isValid, handleCheckout }: any) => (
    <Card className="p-6 contactForm">
        <h2 className="text-xl font-bold dark:text-white mb-4">Payment Details</h2>
        <form onSubmit={handleSubmit(handleCheckout)} className="space-y-4">
            <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <TextInput id="cardNumber" placeholder="1234 5678 9012 3456" {...register("cardNumber")} />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <TextInput id="expiryDate" placeholder="MM/YY" {...register("expiryDate")} />
                    {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>}
                </div>
                <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <TextInput id="cvv" placeholder="123" {...register("cvv")} />
                    {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
                </div>
            </div>
            <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <TextInput id="cardholderName" placeholder="John Doe" {...register("cardholderName")} />
                {errors.cardholderName && <p className="text-red-500 text-sm">{errors.cardholderName.message}</p>}
            </div>
            <Button type="submit" className="w-full" id="submitContact" disabled={loading || !isValid}>
                {loading ? "Processing..." : "Place Order"}
            </Button>
        </form>
    </Card>
);

const EmptyCart = () => (
    <div className="text-center pt-[75px] pb-[65px]">
        <p className="text-gray-600 dark:text-gray-400 text-2xl mb-9">Your cart is empty</p>
        <Link to="/"><Button color="blue" className="dark:!bg-slate-800 dark:text-slate-200 dark:!border-white m-auto w-[50%]">Continue Shopping</Button></Link>
    </div>
);

//the main component
const ShoppingCart = () => {
    const { user } = useAuth();
    const { cartItems, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useAddToCart();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<PaymentDetails>({
        mode: "onChange",
        resolver: joiResolver(paymentSchema),
    });

    const handleCheckout = async (paymentDetails: PaymentDetails) => {
        if (!user) return toast.error("Please login to checkout");
        if (cartItems.length === 0) return toast.error("Your cart is empty");

        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                totalItems,
                totalPrice,
                paymentDetails
            };

            // const token = localStorage.getItem("token");
            //axios.defaults.headers.common["x-auth-token"] = token;
            await api.post("/orders", orderData);

            toast.success("Order placed successfully!");
            clearCart();
            reset();
        } catch (err) {
            console.error(err);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <PleaseLogin />;

    if (user.isAdmin) {
        return <Navigate to="/" replace state={{ error: "Administrators can't make orders and don't have a cart" }} />;
    }

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1 className="!mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(item => <CartItem key={item.product._id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />)}
                        </div>
                        <div className="space-y-6">
                            <CartSummary totalPrice={totalPrice} />
                            <PaymentForm register={register} handleSubmit={handleSubmit} errors={errors} loading={loading} isValid={isValid} handleCheckout={handleCheckout} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;