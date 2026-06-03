import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchPost } from "../../api/post/post";

import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FiTag, FiSearch } from "react-icons/fi";
import { HiOutlineHashtag } from "react-icons/hi";
import PostListCard from "../../components/ui/PostListCard";

const TAB_TYPES = [
    { key: "post", label: "Bài viết", icon: <IoDocumentTextOutline className="text-base" /> },
    { key: "user", label: "Người dùng", icon: <FaRegUser className="text-sm" /> },
    { key: "tag", label: "Tag", icon: <FiTag className="text-sm" /> },
];

const PostSkeleton = () => (
    <div className="flex gap-4 p-4 animate-pulse">
        <div className="bg-gray-200 rounded-xl w-[200px] h-[130px] flex-shrink-0 hidden sm:block" />
        <div className="flex flex-col gap-3 flex-1">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="flex gap-3 mt-auto">
                <div className="h-7 w-7 bg-gray-200 rounded-full" />
                <div className="h-3 bg-gray-200 rounded w-24 self-center" />
            </div>
        </div>
    </div>
);

const UserSkeleton = () => (
    <div className="flex items-center gap-4 p-5 animate-pulse">
        <div className="h-14 w-14 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-full" />
    </div>
);

const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <FiSearch className="text-3xl text-gray-300" />
        </div>
        <p className="text-lg font-medium text-gray-500">Không tìm thấy kết quả</p>
        <p className="text-sm text-center max-w-xs">
            {type === "user"
                ? "Không có người dùng nào khớp với từ khóa này."
                : type === "tag"
                ? "Không có tag nào khớp với từ khóa này."
                : "Không có bài viết nào khớp với từ khóa này."}
        </p>
    </div>
);

const SearchPostPage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchValue = searchParams.get("search_query") || "";
    const type = searchParams.get("type") || "post";
    const page = searchParams.get("page") || "1";

    const navigate = useNavigate();

    const search = async () => {
        setLoading(true);
        setData(null);
        try {
            const result = await searchPost(searchValue, type, page, 10);
            setData(result.items ?? []);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchValue) search();
    }, [type, searchValue, page]);

    const goTo = (tabType) =>
        navigate(`/search?search_query=${encodeURIComponent(searchValue)}&type=${tabType}&page=1`);

    return (
        <div className="container-app">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
                    <FiSearch className="text-xs" />
                    Kết quả tìm kiếm
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {searchValue ? (
                        <>
                            Tìm kiếm cho{" "}
                            <span className="text-amber-600 italic">"{searchValue}"</span>
                        </>
                    ) : (
                        "Nhập từ khóa để tìm kiếm"
                    )}
                </h1>
            </div>

            {/* Main card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    {TAB_TYPES.map((tab) => {
                        const active = type === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => goTo(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 relative
                                    ${active
                                        ? "text-amber-600"
                                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {active && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Results */}
                <div className="min-h-[300px]">
                    {/* Loading */}
                    {loading && (
                        <div className="divide-y divide-gray-100">
                            {type === "user"
                                ? Array.from({ length: 4 }).map((_, i) => <UserSkeleton key={i} />)
                                : Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)}
                        </div>
                    )}

                    {/* Posts */}
                    {!loading && data !== null && type !== "user" && type !== "tag" && (
                        data.length === 0 ? (
                            <EmptyState type={type} />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.map((p) => (
                                    <div key={p.postId} className="px-2 py-1">
                                        <PostListCard post={p} showAction={true} />
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Tags */}
                    {!loading && data !== null && type === "tag" && (
                        data.length === 0 ? (
                            <EmptyState type="tag" />
                        ) : (
                            <div className="p-6 flex flex-wrap gap-3">
                                {data.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 text-gray-700 rounded-full text-sm font-medium cursor-pointer transition-colors"
                                    >
                                        <HiOutlineHashtag className="text-base" />
                                        {tag.name ?? tag}
                                    </span>
                                ))}
                            </div>
                        )
                    )}

                    {/* Users */}
                    {!loading && data !== null && type === "user" && (
                        data.length === 0 ? (
                            <EmptyState type="user" />
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {data.map((u) => (
                                    <div
                                        key={u.userName}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/user-profile/${u.userName}`)}
                                    >
                                        <img
                                            src={u.avatar || "/user.webp"}
                                            alt={u.userName}
                                            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {u.firstName} {u.lastName}
                                            </p>
                                            <p className="text-sm text-gray-400 truncate">
                                                @{u.userName}
                                            </p>
                                        </div>
                                        <span className="flex-shrink-0 text-xs font-medium text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors">
                                            Xem trang
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPostPage;
