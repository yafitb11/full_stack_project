import { IoInformationCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const linkToAbout = () => { navigate("/about"); }

    return (
        <div className="p-3 flex items-center justify-center bg-slate-800 text-white hover:text-cyan-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:text-white">
            <IoInformationCircleSharp onClick={linkToAbout} className="text-2xl cursor-pointer"></IoInformationCircleSharp>
            <h3 onClick={linkToAbout} className="cursor-pointer">About</h3>
        </div>
    )

}

export default Footer;