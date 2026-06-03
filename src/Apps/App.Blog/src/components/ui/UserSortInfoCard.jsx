import { Link } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";

const UserSortInfoCard = ({ user }) => {
    return (
        <Link
            to={`/user-profile/${user?.userName}`}
            className="flex items-center gap-3 px-3 py-3 hover:bg-amber-50/50 rounded-xl transition-colors group"
        >
            <div className="relative flex-shrink-0">
                <img
                    src={user.avatarUrl || '/user.webp'}
                    alt="avatar"
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 group-hover:text-amber-800 transition-colors truncate">
                    {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">@{user.userName}</p>
            </div>
            <span className="flex-shrink-0 text-xs text-gray-300 group-hover:text-amber-400 transition-colors">
                <FiUserCheck />
            </span>
        </Link>
    );
};

export default UserSortInfoCard;
