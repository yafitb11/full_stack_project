import { Button } from "flowbite-react"
import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
    const navigate = useNavigate();
    const goHome = () => { navigate("/") }
    return (
        <div className="min-h-[90vh] flex flex-col items-center gap-3 pt-2 bg-blue-300 dark:bg-slate-400">
            <h1 className="text-3xl m-1">page not found</h1>

            <div className="w-full flex justify-center bg-blue-100 dark:bg-slate-800">
                <div className="flex flex-col items-center justify-center gap-9 w-[70%] aspect-[2/1] xs:w-[89%] p-5 my-4 rounded-[10px] bg-lightblue dark:bg-slate-500">
                    <h1 className="text-7xl font-bold text-center">Error 404!!</h1>
                    <Button onClick={goHome}>go home</Button>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage;