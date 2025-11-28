import { IoInformationCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const linkToAbout = () => { navigate("/about"); }

    return (
        <div className="p-4 flex items-center justify-center gap-2 bg-slate-500 text-white dark:bg-slate-900 dark:text-gray-400">
            <IoInformationCircleSharp
                onClick={linkToAbout}
                className="text-2xl cursor-pointer text-white hover:text-cyan-400 transition-colors dark:text-gray-400 dark:hover:text-white"
            />
            <h3
                onClick={linkToAbout}
                className="cursor-pointer text-white hover:text-cyan-400 transition-colors dark:text-gray-400 dark:hover:text-white"
            >
                About
            </h3>
        </div>
    )

}

export default Footer;