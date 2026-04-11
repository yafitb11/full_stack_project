import { Button, Card, TextInput, Textarea, Label } from "flowbite-react";
import { toast } from "react-toastify";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { contactMessageSchema } from "../validations/newContactMessage.joi";
import { TContactFormData } from "../types/formData";
import api from "../api/api";

const Contact = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<TContactFormData>({
        mode: "onChange",
        resolver: joiResolver(contactMessageSchema),
        defaultValues: {
            fullName: "",
            email: "",
            subject: "",
            message: ""
        }
    });

    const onSubmit = async (formData: TContactFormData) => {
        try {
            const messageData = {
                fullName: formData.fullName,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            };

            await api.post("/contactMessages", messageData);
            toast.success("Message sent successfully!", { autoClose: 2000 });
            reset();
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send the message. Please try again.");
        }
    };

    return (
        <div className="pageDiv">
            <div className="max-w-6xl mx-auto">
                <div className="pageTextAndButtonsDiv">
                    <h1>
                        Contact Us
                    </h1>
                    <p>
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Get in Touch
                        </h2>

                        <p className="text-gray-600 dark:text-slate-300 mb-8">
                            Have a question about our products or need help with your order?
                            We're here to help!
                        </p>

                        <div className="space-y-6">

                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                    <FaPhone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                                    <p className="text-gray-600 dark:text-slate-300">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                    <FaEnvelope className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                                    <p className="text-gray-600 dark:text-slate-300">support@eshop.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                                    <FaMapMarkerAlt className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Address</h3>
                                    <p className="text-gray-600 dark:text-slate-300">
                                        123 Commerce Street<br />Business District, BD 12345
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                                    <FaClock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                                    <p className="text-gray-600 dark:text-slate-300">
                                        Mon–Fri: 9:00–18:00<br />
                                        Sat: 10:00–16:00<br />
                                        Sun: Closed
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div>
                        <Card className="p-6">

                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Send us a Message
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 contactForm">

                                <div>
                                    <Label htmlFor="name" value="*Full Name" />
                                    <TextInput id="name" {...register("fullName")} />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email" value="*Email Address" />
                                    <TextInput id="email" type="email" {...register("email")} />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="subject" value="*Subject" />
                                    <TextInput id="subject" {...register("subject")} />
                                    {errors.subject && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="message" value="*Message" />
                                    <Textarea id="message" rows={5} {...register("message")} />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                                    )}
                                </div>

                                <Button id="submitContact"
                                    type="submit"
                                    className="w-full "
                                    disabled={!isValid}
                                >
                                    Send Message
                                </Button>

                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
