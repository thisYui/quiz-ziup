import { Button } from '../../ui/button';

export const AddQuizButton = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            title="Create new quiz"
            className="w-16 h-28 bg-lime-300 hover:bg-lime-400 text-2xl font-bold text-black flex items-center justify-center rounded-xl shadow-md cursor-pointer"
        >
            +
        </Button>
    );
};