import { useEffect, useState } from "react";
import { getBookMarkPostByUserId, getPostsByUserId, getPostsTrending } from "../../api/post/post";
import { CiBookmark, CiGrid41 } from "react-icons/ci";
import { RiQuillPenLine } from "react-icons/ri";
import { BsCollection, BsEye } from "react-icons/bs";
import CustomSelect from "../../components/common/Select/CustomSelect";
import { useParams, useSearchParams } from "react-router-dom";
import { followUserAPI, getUserInfoKeyCloakByUserName, unFollowUserAPI } from "../../api/user/user";
import BackToTopButton from "../../components/common/Button/BackToTopButton";
import { useKeycloak } from "@react-keycloak/web";
import Popup from "../../components/ui/Popup";
import { GoBookmark } from "react-icons/go";

const UserProfilePage = () => {
    const { username } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'createdPosts';
    const { keycloak, initialized } = useKeycloak();
    const [data, setData] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const [openPopupConfirmUnFollow, setOpenPopupConfirmUnFollow] = useState(false); 

    useEffect(() => {
        document.title = `Những bài viết của ${userInfo?.firstName} ${userInfo?.lastName}`;
    }, [userInfo]);

    const getUserInfo = async () => {
        const response = await getUserInfoKeyCloakByUserName(username);
        setUserInfo(response);
    }

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
        const response = await getBookMarkPostByUserId(1, 10, userInfo?.userId);
        setData(response.items);
    }

    useEffect(() => {
        if (currentTab === 'savedPosts') {
            getBookMarkPosts();
        }
    }, [currentTab])

    useEffect(() => {
        getUserInfo();
    }, [username])

    useEffect(() => {
        if (userInfo?.userId) {
            getData(userInfo?.userId);
        }
    }, [userInfo])

    const options = [
        {
            label: "Chế độ xem lưới",
            value: "1",
            isSelect: true
        },
        {
            label: "Chế độ xem từng bài",
            value: "2",
            isSelect: false
        },
    ];

    const nextPage = async () => {
        let updatePage = currentPage + 1;
        setCurrentPage(updatePage);
        const result = await getPostsByUserId(updatePage, pageSize, userInfo.userId);
        let dataArr = [...data, ...result.items];
        setData(dataArr);
        setHasNextPage(result.hasNextPage);
    }

    const followUser = async () => {
        const obj = {
            followerId: keycloak?.tokenParsed?.sub,
            followingId: userInfo?.userId
        }
        await followUserAPI(obj);
        await getUserInfo();
    }

    const unFollowUser = async () => {
        const obj = {
            followerId: keycloak?.tokenParsed?.sub,
            followingId: userInfo?.userId
        }
        await unFollowUserAPI(obj);
        await getUserInfo();
        setOpenPopupConfirmUnFollow(false);
    }

    const checkFollowed = (userId) => {
        const isFollowed = userInfo?.follows.some(f => f.followerId == userId);

        return isFollowed;
    }

    return (
        <>
            <div className="container-app flex gap-5">
                <div className="bg-gray-200 rounded-md w-3/12 flex flex-col items-center gap-2 py-3">
                    <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='image' className='h-36 w-36 rounded-full' />
                    <div>
                        <div className="font-bold text-lg">{userInfo?.firstName} {userInfo?.lastName}</div>
                        <div className="text-gray-500 text-base">@{userInfo?.userName}</div>
                    </div>
                    {checkFollowed(keycloak?.tokenParsed?.sub) ? (
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
                            {userInfo?.followersCount} <br /> followers
                        </div>
                        <div>
                            {userInfo?.followingCount} <br /> following
                        </div>
                        <div>
                            {totalPosts} <br /> posts
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 w-9/12 rounded-md">
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
                            <select className="py-1 focus:outline-none bg-gray-100">
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
                            <CustomSelect options={options} />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-x-5 mt-2 items-stretch'>
                        {data?.map((p) => (
                            <div key={p.postId} className='w-fit flex flex-col gap-y-3 bg-gray-100'>
                                <img
                                    src='/notebook.png'
                                    alt='image'
                                    className='h-auto w-56 rounded-lg object-cover'
                                />
                                <div className='flex justify-between items-center'>
                                    <p className='text-gray-400'>{p.readingTime} phút đọc</p>
                                    <CiBookmark className='h-5 w-5 text-gray-400' />
                                </div>
                                <div className="h-full w-full flex flex-col justify-between">
                                    <p className="w-auto">{p.title}</p>
                                    <div className='flex items-center justify-between gap-x-3'>
                                        <div className='text-gray-400'>17 Th6</div>
                                        <span className="grid grid-cols-2 place-items-center">
                                            <BsEye />
                                            {p.viewCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
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