import { Button } from "flowbite-react";
import { FaTh, FaThList } from "react-icons/fa";


type ViewButtonsProps = {
    viewMode: "large" | "compact";
    onChange: (mode: "large" | "compact") => void;
    className?: string;
};


const ViewButtons = ({ viewMode, onChange }: ViewButtonsProps) => {
    return (
        <div className="md:absolute left-0 top-1/2 -translate-y-1/2 flex gap-2">
            <Button
                color={viewMode === 'large' ? 'blue' : 'dark'}
                onClick={() => onChange('large')}
                className={`flex items-center gap-2 ${viewMode === 'large' ? '' : 'dark:!text-slate-200'}`}
                size="sm"
            >
                <FaThList />
                <span className="hidden sm:inline">Large</span>
            </Button>
            <Button
                color={viewMode === 'compact' ? 'blue' : 'dark'}
                onClick={() => onChange('compact')}
                className={`flex items-center gap-2 ${viewMode === 'compact' ? '' : 'dark:!text-slate-200'}`}
                size="sm"
            >
                <FaTh />
                <span className="hidden sm:inline">Compact</span>
            </Button>
        </div>
    );
};

export default ViewButtons;