
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { TContactMessage } from "../types/types";
//import axios from "axios";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import api from "../api/api";

const ContactMessages = () => {
    const [messages, setMessages] = useState<TContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    // const token = localStorage.getItem("token");
    useEffect(() => {
        const getMessages = async () => {
            try {
                setLoading(true)
                // axios.defaults.headers.common["x-auth-token"] = token;
                const response = await api.get("/contactMessages",);
                setMessages(response.data);

            } catch (error) {
                console.error("Error fetching messages:", error);
                toast.error("something's wrong");
            } finally { setLoading(false) }
        };
        getMessages();
    }, []);


    if (loading) {
        return (
            <div className="pageDiv">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Messages...</p>
                </div>
            </div>
        );
    }

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
                <h1>
                    Contact Messages
                </h1>
                <p>
                    These are the messages recieved from customers
                </p>
            </div>

            <div className="pageCardsDiv">
                {messages.map((message) => (
                    <Card key={message._id} className="mycard">
                        <div className="textDiv">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-2">
                                sent from: {message.fullName}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                email: {message.email}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                created at: {message.createdAt}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 font-bold">
                                subject: {message.subject}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                message: {message.message}
                            </p>
                        </div>

                        <div className="cardButtonsDiv">
                        </div>
                    </Card>
                ))}
            </div>

            {messages.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No messages have been sent.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
