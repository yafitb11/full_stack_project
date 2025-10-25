import { useState } from "react";
import { Button, Card, TextInput, Textarea, Label } from "flowbite-react";
import { toast } from "react-toastify";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields", { autoClose: 2000 });
            return;
        }

        // Simulate form submission
        toast.success("Message sent successfully! We'll get back to you soon.", { autoClose: 3000 });

        // Reset form
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: ""
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Get in Touch
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Have a question about our products or need help with your order?
                                We're here to help! Reach out to us using any of the methods below.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                    <FaPhone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                    <FaEnvelope className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-400">support@eshop.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                                    <FaMapMarkerAlt className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Address</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        123 Commerce Street<br />
                                        Business District, BD 12345
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                                    <FaClock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Send us a Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" value="Email Address" />
                                    <TextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="subject" value="Subject" />
                                    <TextInput
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        placeholder="What's this about?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message" value="Message" />
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us more about your inquiry..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button type="submit" color="blue" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                How do I track my order?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Once your order is shipped, you'll receive a tracking number via email.
                                You can use this to track your package on our website.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                What is your return policy?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We offer a 30-day return policy for most items. Items must be in
                                original condition with tags attached. Contact us for return instructions.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Do you ship internationally?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Yes, we ship to most countries worldwide. Shipping costs and delivery
                                times vary by location. Check our shipping page for details.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                How can I change my account information?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                You can update your account information by logging into your account
                                and going to the Profile section. All changes are saved automatically.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
