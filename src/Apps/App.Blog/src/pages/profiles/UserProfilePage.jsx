import { useEffect, useState } from "react";
import { getBookMarkPostByUserId, getPostsByUserId, getPostsTrending } from "../../api/post/post";
import { CiBookmark, CiEdit, CiGrid41 } from "react-icons/ci";
import { RiQuillPenLine } from "react-icons/ri";
import { BsCollection, BsEye } from "react-icons/bs";
import CustomSelect from "../../components/common/Select/CustomSelect";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { followUserAPI, getUserInfoKeyCloakByUserName, unFollowUserAPI } from "../../api/user/user";
import BackToTopButton from "../../components/common/Button/BackToTopButton";
import { useKeycloak } from "@react-keycloak/web";
import Popup from "../../components/ui/Popup";
import { GoBookmark } from "react-icons/go";
import useAuthGuard from "../../utils/useAuthGuard";
import PostListColCard from "../../components/ui/PostListColCard";

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
    const {requireLogin, getUserName} = useAuthGuard();

    useEffect(() => {
        document.title = `Những bài viết của ${authorInfo?.firstName} ${authorInfo?.lastName}`;
    }, [authorInfo]);

    const getAuthorInfo = async () => {
        const response = await getUserInfoKeyCloakByUserName(username);
        setAuthorInfo(response);
    }

    useEffect(() => {
        getAuthorInfo();
    }, [username]);

    const getData = async (userId) => {
        const response = await getPostsByUserId(currentPage, pageSize, userId);
        setData(response.items);
        setHasNextPage(response.hasNextPage);
        setTotalPosts(response.totalCount);
    }

    const handleTabChange = (tabName) => {
        setSearchParams({tab: tabName});
    }

    const getBookMarkPosts = async () => {
        const response = await getBookMarkPostByUserId(1, 10, authorInfo?.userId);
        setData(response.items);
    }

    useEffect(() => {
        if (currentTab === 'createdPosts') {
            getData(authorInfo?.userId);
        }
        else if (currentTab === 'savedPosts') {
            getBookMarkPosts();
        }
    }, [currentTab, authorInfo]);

    // const options = [
    //     {
    //         label: "Chế độ xem lưới",
    //         value: "1",
    //         isSelect: true
    //     },
    //     {
    //         label: "Chế độ xem từng bài",
    //         value: "2",
    //         isSelect: false
    //     },
    // ];

    const nextPage = async () => {
        let updatePage = currentPage + 1;
        setCurrentPage(updatePage);
        const result = await getPostsByUserId(updatePage, pageSize, authorInfo.userId);
        let dataArr = [...data, ...result.items];
        setData(dataArr);
        setHasNextPage(result.hasNextPage);
    }

    const followUser = async () => {
        if (!requireLogin()) return;

        const obj = {
            followerId: keycloak?.tokenParsed?.sub,
            followingId: authorInfo?.userId
        }
        await followUserAPI(obj);
        await getauthorInfo();
    }

    const unFollowUser = async () => {
        const obj = {
            followerId: keycloak?.tokenParsed?.sub,
            followingId: authorInfo?.userId
        }
        await unFollowUserAPI(obj);
        await getauthorInfo();
        setOpenPopupConfirmUnFollow(false);
    }

    const checkFollowed = (userId) => {
        const isFollowed = authorInfo?.follows.some(f => f.followerId == userId);

        return isFollowed;
    }

    return (
        <>
            <div className="container-app flex gap-5">
                <div className="bg-gray-200 rounded-md w-3/12 flex flex-col items-center gap-2 py-3">
                    <img src={`${authorInfo?.avatarUrl}`} alt='image' className='h-36 w-36 rounded-full object-cover' />
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-lg">
                                {authorInfo?.firstName} {authorInfo?.lastName} 
                            </div>
                            <Link
                                to={`/user-profile/settings`}
                            >
                                <CiEdit  className="mt-1 h-7 w-6 text-blue-400"/>
                            </Link>
                        </div>
                        <div className="text-gray-500 text-base">@{authorInfo?.userName}</div>
                    </div>

                    {authorInfo?.userName !== getUserName() && (
                        checkFollowed(keycloak?.tokenParsed?.sub) ? (
                            <button
                                className="bg-blue-200 px-5 py-2 text-blue-500 rounded-md"
                                onClick={() => setOpenPopupConfirmUnFollow(true)}
                            >
                                Đang theo dõi
                            </button>
                        ) : (
                            <button
                                className="bg-blue-200 px-5 py-2 text-blue-500 rounded-md"
                                onClick={() => followUser()}
                            >
                                Theo dõi
                            </button>
                        )
                    )}

                    <div>
                        <Popup 
                            isOpen={openPopupConfirmUnFollow} 
                            onClose={() => setOpenPopupConfirmUnFollow(false)}
                            title={"Xác nhận"}
                        >
                            <p className="text-gray-500">Xác nhận bỏ theo dõi người dùng</p>
                            <div className="flex justify-between px-16 pt-5">
                                <button
                                    className="bg-blue-500 rounded-md p-3 w-24 text-white font-semibold"
                                    onClick={() => unFollowUser()}    
                                >
                                    Có
                                </button>
                                <button
                                    className="border-[2px] border-gray-400 rounded-md p-3 w-24 font-semibold"
                                    onClick={() => setOpenPopupConfirmUnFollow(false)}
                                >
                                    Không
                                </button>
                            </div>
                        </Popup>
                    </div>
                    
                    <div className="flex flex-wrap gap-7 max-w-full p-2">
                        <div>
                            {authorInfo?.followersCount} <br /> followers
                        </div>
                        <div>
                            {authorInfo?.followingCount} <br /> following
                        </div>
                        <div>
                            {totalPosts} <br /> posts
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 w-9/12 rounded-md">
                    <div className="flex justify-between">
                        <div className="flex gap-8 px-4">
                            <div>
                                <button
                                    className="flex gap-1 items-center px-3 py-2 rounded-sm hover:bg-blue-200"
                                    onClick={() => handleTabChange('createdPosts')}
                                >
                                    <RiQuillPenLine />
                                    Bài viết
                                </button>
                                {currentTab === 'createdPosts' && <div className="h-[2px] w-full bg-blue-500"></div>}
                            </div>
                            <div>
                                <button
                                    className="flex gap-1 items-center px-3 py-2 rounded-sm hover:bg-blue-200"
                                    onClick={() => handleTabChange('series')}
                                >
                                    <BsCollection />
                                    Series
                                </button>
                                {currentTab === 'series' && <div className="h-[2px] w-full bg-blue-500"></div>}
                            </div>
                            {authorInfo?.userName === getUserName() &&
                                <div>
                                    <button
                                        className="flex gap-1 items-center px-3 py-2 rounded-sm hover:bg-blue-200"
                                        onClick={() => handleTabChange('savedPosts')}
                                    >
                                        <GoBookmark />
                                        Đã lưu
                                    </button>
                                    {currentTab === 'savedPosts' && <div className="h-[2px] w-full bg-blue-500"></div>}
                                </div>
                            }
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-between mt-5">
                        <div>
                            {/* <Select
                                options={dataFilter.options}
                                value={dataFilter.options}
                                onChange={(value) => handleFilterChange(filter.fieldName, value)}
                                isMulti={""}
                                placeholder={dataFilter.label}
                            /> */}
                            <select className="py-1 focus:outline-none bg-gray-50">
                                <option value="someOption">Theo thời gian</option>
                                <option value="otherOption">Theo độ nổi bật</option>
                            </select>
                        </div>
                        <div>
                            {/* <ul className="py-1 focus:outline-none">
                                <li className="flex items-center gap-2">
                                    <CiGrid41 />
                                    Chế độ xem lưới
                                </li>
                                <li className="flex items-center gap-2">
                                    <MdOutlineTableRows />
                                    Chế độ xem từng bài
                                </li>
                            </ul> */}
                            {/* <CustomSelect options={options} /> */}
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-x-5 mt-2 items-stretch'>
                        {data?.map((p) => (
                            <PostListColCard key={p.postId} post={p} showAuthor={false}/>
                        ))}

                    </div>
                    {hasNextPage && <div className="w-full bg-white mt-5">
                        <button
                            className="w-full border-[1px] border-blue-300 rounded-md p-2"
                            onClick={() => nextPage()}
                        >
                            Tải thêm
                        </button>
                    </div>
                    }
                </div>
                <BackToTopButton />
            </div>
        </>
    )
}

export default UserProfilePage;