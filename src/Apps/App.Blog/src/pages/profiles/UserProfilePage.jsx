import { useEffect, useState } from "react";
import { deletePost, getBookMarkPostByUserId, getPostsByUserId } from "../../api/post/post";
import { CiEdit } from "react-icons/ci";
import { RiQuillPenLine } from "react-icons/ri";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { followUserAPI, getUserFollowersAPI, getUserFollowingsAPI, getUserInfoKeyCloakByUserName, unFollowUserAPI } from "../../api/user/user";
import BackToTopButton from "../../components/common/Button/BackToTopButton";
import { useKeycloak } from "@react-keycloak/web";
import Popup from "../../components/ui/Popup";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import useAuthGuard from "../../utils/useAuthGuard";
import PostListColCard from "../../components/ui/PostListColCard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { Button } from "@headlessui/react";
import UserSortInfoCard from "../../components/ui/UserSortInfoCard";
import { converterTimeToOnlyDate } from "../../utils/handleTimeShow";
import { LuPenLine } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import ImageZoom from "../../components/ui/ImageZoom";
import { toast, ToastContainer } from "react-toastify";
import { FiUserPlus, FiUserCheck, FiUsers } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsFileEarmarkText } from "react-icons/bs";

const UserProfilePage = () => {
    const { username } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'createdPosts';
    const { keycloak, initialized } = useKeycloak();
    const [data, setData] = useState([]);
    const [authorInfo, setAuthorInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const [openPopupConfirmUnFollow, setOpenPopupConfirmUnFollow] = useState(false);
    const { requireLogin, getUserName } = useAuthGuard();
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [dataFilter, setDataFilter] = useState(null);
    const [dataUserFollow, setDataUserFollow] = useState([]);
    const [openPopupConfirmDeletePost, setOpenPopupConfirmDeletePost] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const isOwner = authorInfo?.userName === getUserName();

    const getAuthorInfo = async () => {
        const response = await getUserInfoKeyCloakByUserName(username);
        setAuthorInfo(response);
        setAvatarLoading(false);
    };

    useEffect(() => {
        getAuthorInfo();
        setDataFilter(null);
        setCurrentPage(1);
        setDataUserFollow([]);
        setSearchParams({ tab: 'createdPosts' });
    }, [username]);

    const getData = async (userId) => {
        const response = await getPostsByUserId(currentPage, pageSize, userId);
        setData(response.items);
        setHasNextPage(response.hasNextPage);
        setTotalPosts(response.totalCount);
    };

    const handleTabChange = (tabName) => {
        setSearchParams({ tab: tabName });
        setDataFilter(null);
    };

    const getBookMarkPosts = async (userId) => {
        const response = await getBookMarkPostByUserId(1, 10, userId);
        setData(response.items);
    };

    useEffect(() => {
        if (currentTab === 'createdPosts') {
            getData(authorInfo?.userId);
            document.title = `Những bài viết của ${authorInfo?.firstName} ${authorInfo?.lastName}`;
        } else if (currentTab === 'savedPosts') {
            getBookMarkPosts(authorInfo?.userId);
            document.title = `Những bài viết đã lưu của bạn`;
        }
    }, [currentTab, authorInfo]);

    const nextPage = async () => {
        const updatePage = currentPage + 1;
        setCurrentPage(updatePage);
        const result = await getPostsByUserId(updatePage, pageSize, authorInfo.userId);
        setData(prev => [...prev, ...result.items]);
        setHasNextPage(result.hasNextPage);
    };

    const followUser = async () => {
        if (!requireLogin()) return;
        await followUserAPI({ followerId: keycloak?.tokenParsed?.sub, followingId: authorInfo?.userId });
        await getAuthorInfo();
    };

    const unFollowUser = async () => {
        await unFollowUserAPI({ followerId: keycloak?.tokenParsed?.sub, followingId: authorInfo?.userId });
        await getAuthorInfo();
        setOpenPopupConfirmUnFollow(false);
    };

    const checkFollowed = (userId) => authorInfo?.follows?.some(f => f.followerId == userId);

    const getUserFollowers = async () => {
        setDataFilter("followers");
        const response = await getUserFollowersAPI(authorInfo?.userId);
        setDataUserFollow(response);
    };

    const getUserFollowings = async () => {
        setDataFilter("followings");
        const response = await getUserFollowingsAPI(authorInfo?.userId);
        setDataUserFollow(response);
    };

    const getDraftPosts = async () => {
        setDataFilter("draftPosts");
        const response = await getPostsByUserId(currentPage, pageSize, authorInfo?.userId, 0);
        setData(response.items);
    };

    const handleDeletePost = async (postId) => {
        const result = await deletePost(postId);
        if (result) {
            setData(prev => prev.filter(p => p.postId !== postId));
            setOpenPopupConfirmDeletePost(false);
            setPostToDelete(null);
            toast.success("Xóa bài viết thành công.");
        } else {
            toast.error("Xóa bài viết thất bại. Vui lòng thử lại.");
        }
    };

    // ── Section title helper ──
    const sectionTitle = () => {
        if (dataFilter === "followers") return `Người theo dõi (${dataUserFollow.length})`;
        if (dataFilter === "followings") return `Đang theo dõi (${dataUserFollow.length})`;
        if (dataFilter === "draftPosts") return "Bài viết nháp";
        if (currentTab === "savedPosts") return "Bài viết đã lưu";
        return "Bài viết";
    };

    const avatarSrc = authorInfo?.avatarUrl || '/user.webp';

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container-app !pt-6 !pb-12">
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* ════════════ LEFT: Profile Card ════════════ */}
                        <div className="w-full md:w-[280px] flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                                {/* Banner gradient */}
                                <div className="h-24 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400" />

                                {/* Avatar + info */}
                                <div className="px-5 pb-5">
                                    <div className="flex items-end justify-between -mt-12 mb-3">
                                        {avatarLoading ? (
                                            <div className="w-20 h-20 rounded-full bg-amber-100 ring-4 ring-white flex items-center justify-center">
                                                <AiOutlineLoading3Quarters className="animate-spin text-amber-600 text-xl" />
                                            </div>
                                        ) : (
                                            <ImageZoom
                                                src={avatarSrc}
                                                alt="Avatar"
                                                className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                                            />
                                        )}
                                        {isOwner && (
                                            <Link
                                                to="/user-profile/settings"
                                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-amber-700 bg-gray-100 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 px-3 py-1.5 rounded-full transition-all"
                                            >
                                                <CiEdit className="text-sm" />
                                                Chỉnh sửa
                                            </Link>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <h1 className="font-bold text-gray-900 text-lg leading-tight">
                                            {authorInfo?.firstName} {authorInfo?.lastName}
                                        </h1>
                                        <p className="text-gray-400 text-sm mt-0.5">@{authorInfo?.userName}</p>
                                        {authorInfo?.bio && (
                                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">{authorInfo.bio}</p>
                                        )}
                                    </div>

                                    {/* Follow button */}
                                    {!isOwner && initialized && (
                                        checkFollowed(keycloak?.tokenParsed?.sub) ? (
                                            <button
                                                onClick={() => setOpenPopupConfirmUnFollow(true)}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-colors"
                                            >
                                                <FiUserCheck className="text-base" />
                                                Đang theo dõi
                                            </button>
                                        ) : (
                                            <button
                                                onClick={followUser}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-full transition-colors shadow-sm"
                                            >
                                                <FiUserPlus className="text-base" />
                                                Theo dõi
                                            </button>
                                        )
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-1 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={getUserFollowers}
                                            className={`flex flex-col items-center py-2 rounded-xl transition-colors ${dataFilter === 'followers' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-gray-700'}`}
                                        >
                                            <span className="font-bold text-base">{authorInfo?.followersCount ?? 0}</span>
                                            <span className="text-xs text-gray-400 mt-0.5">Theo dõi</span>
                                        </button>
                                        <button
                                            onClick={getUserFollowings}
                                            className={`flex flex-col items-center py-2 rounded-xl transition-colors ${dataFilter === 'followings' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-gray-700'}`}
                                        >
                                            <span className="font-bold text-base">{authorInfo?.followingCount ?? 0}</span>
                                            <span className="text-xs text-gray-400 mt-0.5">Đang theo</span>
                                        </button>
                                        <button
                                            onClick={() => { setDataFilter(null); handleTabChange('createdPosts'); }}
                                            className={`flex flex-col items-center py-2 rounded-xl transition-colors ${!dataFilter && currentTab === 'createdPosts' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-gray-700'}`}
                                        >
                                            <span className="font-bold text-base">{totalPosts}</span>
                                            <span className="text-xs text-gray-400 mt-0.5">Bài viết</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ════════════ RIGHT: Content Panel ════════════ */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                                {/* Tab bar */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-4">
                                    <div className="flex">
                                        {/* Bài viết */}
                                        <button
                                            onClick={() => { handleTabChange('createdPosts'); }}
                                            className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-colors ${
                                                currentTab === 'createdPosts' && !dataFilter
                                                    ? 'text-amber-700'
                                                    : 'text-gray-400 hover:text-gray-700'
                                            }`}
                                        >
                                            <RiQuillPenLine className="text-base" />
                                            Bài viết
                                            {currentTab === 'createdPosts' && !dataFilter && (
                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                                            )}
                                        </button>

                                        {/* Đã lưu (only owner) */}
                                        {isOwner && (
                                            <button
                                                onClick={() => handleTabChange('savedPosts')}
                                                className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-colors ${
                                                    currentTab === 'savedPosts' && !dataFilter
                                                        ? 'text-amber-700'
                                                        : 'text-gray-400 hover:text-gray-700'
                                                }`}
                                            >
                                                <GoBookmark className="text-base" />
                                                Đã lưu
                                                {currentTab === 'savedPosts' && !dataFilter && (
                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                                                )}
                                            </button>
                                        )}

                                        {/* Active filter badge */}
                                        {dataFilter && (
                                            <div className="relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-amber-700">
                                                {dataFilter === 'followers' && <FiUsers className="text-base" />}
                                                {dataFilter === 'followings' && <FiUserCheck className="text-base" />}
                                                {dataFilter === 'draftPosts' && <BsFileEarmarkText className="text-base" />}
                                                {dataFilter === 'followers' && 'Người theo dõi'}
                                                {dataFilter === 'followings' && 'Đang theo dõi'}
                                                {dataFilter === 'draftPosts' && 'Bài viết nháp'}
                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Options menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                                <SlOptionsVertical className="text-sm" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border border-gray-100">
                                            <DropdownMenuItem
                                                onClick={getUserFollowers}
                                                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-lg ${dataFilter === 'followers' ? 'text-amber-700 bg-amber-50' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <FiUsers className="text-gray-400" />
                                                Người theo dõi
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={getUserFollowings}
                                                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-lg ${dataFilter === 'followings' ? 'text-amber-700 bg-amber-50' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <FiUserCheck className="text-gray-400" />
                                                Đang theo dõi
                                            </DropdownMenuItem>
                                            {isOwner && (
                                                <DropdownMenuItem
                                                    onClick={() => { setData([]); getDraftPosts(); }}
                                                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-lg ${dataFilter === 'draftPosts' ? 'text-amber-700 bg-amber-50' : 'text-gray-700 hover:bg-gray-50'}`}
                                                >
                                                    <BsFileEarmarkText className="text-gray-400" />
                                                    Bài viết nháp
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Content body */}
                                <div className="p-4 sm:p-5">

                                    {/* Posts grid */}
                                    {!dataFilter && (
                                        <>
                                            {data?.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {data.map((p) => (
                                                        <PostListColCard key={p.postId} post={p} showAuthor={false} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyState
                                                    icon={currentTab === 'savedPosts' ? <GoBookmarkFill className="text-4xl text-amber-300" /> : <HiOutlineDocumentText className="text-4xl text-amber-300" />}
                                                    text={currentTab === 'savedPosts' ? 'Chưa có bài viết nào được lưu.' : 'Chưa có bài viết nào được đăng.'}
                                                />
                                            )}
                                        </>
                                    )}

                                    {/* Followers / Followings list */}
                                    {(dataFilter === 'followers' || dataFilter === 'followings') && (
                                        <>
                                            {dataUserFollow?.length > 0 ? (
                                                <div className="flex flex-col divide-y divide-gray-50">
                                                    {dataUserFollow.map((f) => (
                                                        <UserSortInfoCard key={f.userId} user={f} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyState
                                                    icon={<FiUsers className="text-4xl text-amber-300" />}
                                                    text="Không có dữ liệu nào."
                                                />
                                            )}
                                        </>
                                    )}

                                    {/* Draft posts list */}
                                    {dataFilter === 'draftPosts' && (
                                        <>
                                            {data?.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {data.map((p) => (
                                                        <div key={p.postId} className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-semibold text-gray-800 text-sm leading-snug truncate group-hover:text-amber-800 transition-colors">
                                                                    {p.title || '(Chưa có tiêu đề)'}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-0.5">{converterTimeToOnlyDate(p.createdAt)}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <Link
                                                                    to={`/post/edit/${p.postId}`}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:border-amber-300 hover:text-amber-700 rounded-lg transition-all"
                                                                >
                                                                    <LuPenLine className="text-sm" />
                                                                    <span className="hidden sm:inline">Tiếp tục</span>
                                                                </Link>
                                                                <button
                                                                    onClick={() => { setPostToDelete(p.postId); setOpenPopupConfirmDeletePost(true); }}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-white border border-red-200 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                                >
                                                                    <MdDelete className="text-sm" />
                                                                    <span className="hidden sm:inline">Xóa</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyState
                                                    icon={<BsFileEarmarkText className="text-4xl text-amber-300" />}
                                                    text="Không có bài viết nháp nào."
                                                />
                                            )}
                                        </>
                                    )}

                                    {/* Load more */}
                                    {hasNextPage && !dataFilter && (
                                        <button
                                            onClick={nextPage}
                                            className="w-full mt-5 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
                                        >
                                            Tải thêm bài viết
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <BackToTopButton />
            </div>

            {/* Unfollow confirm */}
            <Popup
                isOpen={openPopupConfirmUnFollow}
                onClose={() => setOpenPopupConfirmUnFollow(false)}
                title="Xác nhận bỏ theo dõi"
            >
                <p className="text-gray-500 text-sm">
                    Bạn có chắc muốn bỏ theo dõi <span className="font-semibold text-gray-700">{authorInfo?.firstName} {authorInfo?.lastName}</span>?
                </p>
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setOpenPopupConfirmUnFollow(false)}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        onClick={unFollowUser}
                    >
                        Bỏ theo dõi
                    </button>
                </div>
            </Popup>

            {/* Delete post confirm */}
            <Popup
                title="Xác nhận xóa bài viết"
                isOpen={openPopupConfirmDeletePost}
                onClose={() => { setOpenPopupConfirmDeletePost(false); setPostToDelete(null); }}
            >
                <p className="text-gray-500 text-sm">Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => { setOpenPopupConfirmDeletePost(false); setPostToDelete(null); }}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        onClick={() => handleDeletePost(postToDelete)}
                    >
                        Xóa bài viết
                    </button>
                </div>
            </Popup>

            <ToastContainer />
        </>
    );
};

// ── Reusable empty state ──
const EmptyState = ({ icon, text }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 opacity-60">{icon}</div>
        <p className="text-sm text-gray-400">{text}</p>
    </div>
);

export default UserProfilePage;
