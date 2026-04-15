import { useKeycloak } from "@react-keycloak/web";
import { TbWorld } from "react-icons/tb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CiBellOn, CiBookmark, CiPen, CiPenpot, CiSearch } from "react-icons/ci";
import logo from "../../assets/images/logo1.png";
import userImg from "../../assets/images/user.jpg";
import { useEffect, useState } from "react";
import { RiDashboardFill, RiQuillPenLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Notification from "../widgets/Notification";
import { useForm } from "react-hook-form";
import { getUserInfoById } from "../../api/user/user";

const Header = () => {
    const { keycloak, initialized } = useKeycloak();
    const { register, getValues, reset } = useForm({
        defaultValues: {search: ""}
    });
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);


    const [isOpenSearch, setIsOpenSearch] = useState(false);

    const searching = () => {
        if (!isOpenSearch) {
            setIsOpenSearch(true);
        } else {
            const searchValue = getValues("search");
            navigate(`/search?search_query=${searchValue}&type=post&page=1`);
        }
    }

    const fetchUserInfo = async (userId) => {
        try {
            const response = await getUserInfoById(userId);
            setUserInfo(response);
        }
        catch (error) {
            console.log("Fetch user info error", error);
        }
    }

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchUserInfo(keycloak?.tokenParsed?.sub);
        }
        if (initialized && !keycloak.authenticated) {
            setUserInfo(null);
        }
    }, [initialized, keycloak]);

    return (
        <>
            <div className="container-app w-full h-fit bg-cover bg-center shadow-lg py-5 bg-[#f5ede2]">
                <div className="flex justify-between items-center">
                    <a href="/">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-14 h-12"
                        />
                    </a>
                    <div>
                        <ul className="flex gap-x-5 font-semibold">
                            <li>Guid</li>
                            <li>Blogs</li>
                            <li>Products</li>
                        </ul>
                    </div>
                    <div>

                    </div>
                    <div className="flex gap-x-2 relative">
                        {/* <button className="flex gap-x-1 items-center">
                            <div className="bg-white rounded-3xl p-1">
                                <TbWorld />
                            </div>
                            <div>EN</div>
                        </button> */}


                        <div className="flex items-center justify-center gap-5">
                            <div className={`flex gap-1 ${isOpenSearch ? "bg-[#ddd0be] rounded-md py-1 px-2" : ""}`}>
                                {isOpenSearch && <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setIsOpenSearch(false)
                                            reset();
                                        }}
                                        className="text-2xl leading-none"
                                    >
                                        <IoMdClose />
                                    </button>
                                    <input
                                        {...register("search")}
                                        placeholder="Nhập tiêu đề hoặc tên tác giả"
                                        className="border-[1px] border-gray-500 rounded-3xl px-2 py-1 focus:outline-none min-w-[280px]"
                                    />
                                </div>}

                                <button
                                    onClick={() => searching()}
                                >
                                    <CiSearch className="w-6 h-6" />
                                </button>
                            </div>
                            {/* <button
                                onClick={() => console.log("click btn notify")}
                            >
                                <CiBellOn className="w-6 h-6" />
                            </button> */}
                            <div className="w-6">
                                <Notification />
                            </div>
                            <button onClick={() => navigate('/post/create')} className="flex gap-x-1 items-center border-[1px] border-gray-400 rounded-3xl px-4 py-2 select-none">
                                {/* <CiPen /> */}
                                <RiQuillPenLine />
                                Viết bài
                            </button>
                        </div>

                        {/* <div className="flex gap-x-1 items-center">
                            
                        </div> */}
                        <div className="flex items-center">
                            {keycloak.authenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="p-0 flex items-center justify-center rounded-full ml-2">
                                            <div className="select-none">
                                                <img src={`
                                                    ${!userInfo?.avatarUrl ? '/user.webp' : userInfo.avatarUrl}
                                                `}
                                                    alt="user_image"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className="py-1">
                                            <div className="px-4">
                                                <h2 className="font-bold">
                                                    {keycloak?.tokenParsed?.name}
                                                </h2>
                                                <div className="text-sm text-gray-500">
                                                    @{keycloak?.tokenParsed?.preferred_username}
                                                </div>
                                            </div>

                                            <div className="m-1">
                                                <Link
                                                    to={`/user-profile/${keycloak?.tokenParsed?.preferred_username}?tab=createdPosts`}
                                                >
                                                    <DropdownMenuItem className="h-full border-[1px] border-gray-500 rounded-3xl">

                                                        Xem trang cá nhân

                                                    </DropdownMenuItem>
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <Link
                                            to={`/app`}
                                        >
                                            <DropdownMenuItem>
                                                <div className="flex items-center gap-1">
                                                    <RiDashboardFill className="h-5 w-5 text-gray-500" />
                                                    Trang quản lý
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>

                                        <Link
                                            to={`/user-profile/${keycloak?.tokenParsed?.preferred_username}?tab=savedPosts`}
                                        >
                                            <DropdownMenuItem>
                                                <div
                                                    className="flex items-center gap-1"
                                                >
                                                    <CiBookmark className='h-5 w-5 text-gray-500' />
                                                    Đã lưu
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>

                                        <hr />
                                        <DropdownMenuItem onClick={() => keycloak.logout()}>Đăng xuất</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center font-medium">
                                    <button onClick={() => keycloak.login()} className="px-3">Log In</button>
                                    <button className="bg-white border-[2px] border-gray-500 rounded-md py-1 px-2">Sign Up</button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;