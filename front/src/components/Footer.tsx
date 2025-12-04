import { IoInformationCircleSharp } from "react-icons/io5";
import { AiOutlineMail, AiOutlineCopyrightCircle } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import { GiShop } from 'react-icons/gi';

const Footer = () => {
    const navigate = useNavigate();
    const linkToAbout = () => { navigate("/about"); }
    const linkToContact = () => { navigate("/contact"); }

    return (
        <div className="p-4 flex items-center justify-around bg-slate-500 text-white dark:bg-slate-900 dark:text-gray-400">

            <div className="flex gap-1">
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

            <div className="flex gap-1 items-center">
                <AiOutlineCopyrightCircle
                    className="text-2xl text-white hover:text-cyan-400 transition-colors dark:text-gray-400 dark:hover:text-white"
                />
                <div className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors dark:text-gray-400 dark:hover:text-white">
                    <GiShop size={32} />
                    <span className="font-bold text-xl">E-SHOP</span>
                </div>
            </div>

            <div className="flex gap-1">
                <AiOutlineMail
                    onClick={linkToContact}
                    className="text-2xl cursor-pointer text-white hover:text-cyan-400 transition-colors dark:text-gray-400 dark:hover:text-white"
                />
                <h3
                    onClick={linkToContact}
                    className="cursor-pointer text-white hover:text-cyan-400 transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                    Contact us
                </h3>
            </div>

        </div>
    )

}

export default Footer;