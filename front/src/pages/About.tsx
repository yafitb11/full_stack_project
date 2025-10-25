
export default function CreateCard() {

    return (
        <div className="flex flex-col items-center gap-3 pt-2 bg-blue-300 dark:bg-slate-400">
            <h1 className="text-3xl m-1">About the App</h1>
            <div className="w-full flex justify-center bg-blue-100 dark:bg-slate-800">
                <div className="w-[70%] xs:w-[89%] p-5 my-4 rounded-[10px] bg-lightblue dark:bg-slate-500">
                    <p className="">Welcome to BCard – a dynamic business card web application designed to help users discover, manage, and showcase business profiles online. <br />

                        This project was developed as part of a React-based course module, and it integrates key full-stack technologies and concepts. It features a responsive and accessible user interface, role-based content display, and seamless communication with a server-side API. <br />
                        <br />
                        Key Features: <br />
                        User registration and login with form validation and secure JWT authentication. <br />
                        Role-based navigation and permissions: regular user, business user, and admin. <br />
                        Create, read, update, and delete business cards with real-time UI feedback. <br />
                        A personal dashboard displaying all cards created by the logged-in user. <br />
                        Option to mark cards as favorites and manage them in a dedicated page. <br />
                        **Integrated Google Maps API to display business locations dynamically. <br />
                        Responsive design with light/dark mode toggle for improved accessibility. <br />
                        <br />
                        Tech Stack: <br />
                        React, TypeScript, HTML5, CSS3
                        Axios for API communication, React Router-Dom, different Hooks,
                        Global State Management, JWT for authentication,
                        Form validation using regex and controlled components. <br />

                        The application showcases a real-world approach to developing scalable and maintainable React applications.

                    </p>
                </div>
            </div>
        </div>)
}