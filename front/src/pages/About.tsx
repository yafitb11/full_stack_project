
export default function CreateCard() {

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1 className="text-3xl m-1">About the App</h1>
            </div>
            <div className="pageCardsDiv">
                <div className="w-[70%] xs:w-[89%] p-7 my-4 bigBox dark:text-slate-200">
                    <p>
                        <span className="font-bold">
                            Welcome to E-Shop – a full-stack e-commerce web application designed to provide a seamless and intuitive online shopping experience.
                        </span>
                        <br /><br />

                        This project was developed as part of a full-stack course module and showcases the integration of modern front-end and back-end technologies.
                        E-Shop enables customers to browse categories and products, add items to the cart, place orders, and manage their profile and favorites —
                        while providing administrators with full control over store content and user management.
                        <br /><br />

                        <span className="font-bold mb-2">Key Features:</span><br />
                        <div className="h-[8px]" aria-hidden="true" />
                        • <span className="font-bold">User authentication</span> with form validation and secure JWT-based login and registration.<br />
                        • <span className="font-bold">Role-based access control:</span><br />
                        &nbsp;&nbsp;– <span className="font-bold">Customers</span> can like products, manage their cart and orders prior to submission,
                        and edit or delete their profile.<br />
                        &nbsp;&nbsp;– <span className="font-bold">Admins</span> can create, read, update, and delete products and categories,
                        as well as edit or remove user accounts and view contact messages from customers.<br />
                        • <span className="font-bold">Personal dashboard</span> where users can view their orders and favorite products.<br />
                        • <span className="font-bold">Responsive, accessible UI</span> including a light/dark mode toggle for an improved user experience.<br /><br />

                        <span className="font-bold">Tech Stack:</span><br />
                        <div className="h-[8px]" aria-hidden="true" />
                        <span className="font-bold">Front-End:</span> React, TypeScript, HTML5, CSS3, React Router, Hooks, Global State Management, Joi validations.<br />
                        <span className="font-bold">Back-End:</span> Node.js, Express.js, MongoDB, JWT authentication, Joi & Mongoose validations, RESTful API architecture.<br />
                        <span className="font-bold">Additional Features:</span> Axios for API communication, regex-based form validation with controlled components,
                        dynamic category and product filtering.<br /><br />

                        E-Shop reflects a real-world approach to building scalable, maintainable, and interactive full-stack applications —
                        combining modern React-based UI development with a robust server-side architecture to deliver a complete e-commerce solution.
                    </p>
                </div>
            </div>
        </div>)
}