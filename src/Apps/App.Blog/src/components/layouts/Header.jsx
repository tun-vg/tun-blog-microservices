import { useKeycloak } from "@react-keycloak/web";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CiBookmark, CiSearch, CiSettings } from "react-icons/ci";
import logo from "../../assets/images/logo1.png";
import { useEffect, useRef, useState } from "react";
import { RiDashboardFill, RiQuillPenLine, RiMenuLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Notification from "../widgets/Notification";
import { useForm } from "react-hook-form";
import { useUser } from "../../contexts/UserContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";

const NAV_LINKS = [
    { label: "Hướng dẫn", href: "/guide" },
    { label: "Bài viết",   href: "/blogs" },
    { label: "Sản phẩm",  href: "/products" },
];

const Header = () => {
    const { keycloak, initialized } = useKeycloak();
    const { userInfo } = useUser();
    const { register, getValues, reset } = useForm({ defaultValues: { search: "" } });
    const navigate = useNavigate();
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchInputRef = useRef(null);

    const searching = () => {
        if (!isOpenSearch) {
            setIsOpenSearch(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
        } else {
            const searchValue = getValues("search");
            if (searchValue.trim()) {
                navigate(`/search?search_query=${searchValue}&type=post&page=1`);
            }
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") searching();
        if (e.key === "Escape") { setIsOpenSearch(false); reset(); }
    };

    useEffect(() => {
        if (userInfo) setAvatarLoading(false);
    }, [userInfo]);

    // Close mobile menu on route navigate
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const avatarSrc = !userInfo?.avatarUrl ? "/user.webp" : userInfo.avatarUrl;

    return (
        <header className="sticky top-0 z-50 w-full bg-[#f5ede2]/95 backdrop-blur-md border-b border-[#e8d5c4] shadow-sm">

            {/* ── Main row ── */}
            <div className="px-4 sm:px-[5%] md:px-[8%] lg:px-[15%] flex items-center justify-between h-16 gap-3">

                {/* Logo */}
                <a href="/" className="flex-shrink-0">
                    <img src={logo} alt="Logo" className="w-12 h-10 object-contain" />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={href}
                            to={href}
                            className="relative px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:text-amber-800 hover:bg-amber-100/60 transition-all duration-150 group"
                        >
                            {label}
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                        </Link>
                    ))}
                </nav>

                {/* ── Right actions ── */}
                <div className="flex items-center gap-1.5 ml-auto">

                    {/* Search (desktop) */}
                    <div className={`hidden sm:flex items-center gap-1.5 transition-all duration-300 ${isOpenSearch ? "bg-white border border-[#d4b896] rounded-full px-3 py-1.5 shadow-sm" : ""}`}>
                        {isOpenSearch && (
                            <>
                                <button
                                    onClick={() => { setIsOpenSearch(false); reset(); }}
                                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                >
                                    <IoMdClose className="w-4 h-4" />
                                </button>
                                <input
                                    {...register("search")}
                                    ref={(e) => { register("search").ref(e); searchInputRef.current = e; }}
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Tìm kiếm bài viết, tác giả..."
                                    className="bg-transparent text-sm focus:outline-none w-44 lg:w-56 text-gray-800 placeholder:text-gray-400"
                                />
                            </>
                        )}
                        <button
                            onClick={searching}
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpenSearch ? "text-amber-700 hover:bg-amber-100" : "text-gray-600 hover:bg-amber-100 hover:text-amber-800"}`}
                        >
                            <CiSearch className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Notification (desktop) */}
                    <div className="hidden sm:flex items-center justify-center">
                        <Notification />
                    </div>

                    {/* Write button (desktop) */}
                    <button
                        onClick={() => navigate("/post/create")}
                        className="hidden sm:flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
                    >
                        <RiQuillPenLine className="w-4 h-4" />
                        Viết bài
                    </button>

                    {/* Auth dropdown (desktop) */}
                    {!initialized ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-xl text-amber-700 hidden sm:block" />
                    ) : keycloak.authenticated ? (
                        <div className="hidden sm:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0 rounded-full ring-2 ring-transparent hover:ring-amber-400 transition-all duration-150"
                                    >
                                        {avatarLoading ? (
                                            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                                                <AiOutlineLoading3Quarters className="animate-spin text-amber-600" />
                                            </div>
                                        ) : (
                                            <img src={avatarSrc} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl shadow-xl border border-gray-100 bg-white overflow-hidden p-0">
                                    <div className="px-4 py-3 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200" />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">{keycloak?.tokenParsed?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">@{keycloak?.tokenParsed?.preferred_username}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/user-profile/${keycloak?.tokenParsed?.preferred_username}?tab=createdPosts`}
                                            className="mt-2.5 flex items-center justify-center w-full text-xs font-medium text-amber-800 bg-white hover:bg-amber-50 border border-amber-200 rounded-full py-1.5 transition-colors"
                                        >
                                            Xem trang cá nhân
                                        </Link>
                                    </div>
                                    <div className="py-1.5">
                                        <Link to={`/user-profile/${userInfo?.userName}?tab=createdPosts`}>
                                            <DropdownMenuItem className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 cursor-pointer">
                                                <FaRegEdit className="w-4 h-4 text-gray-400" />
                                                Bài viết của tôi
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to="/app">
                                            <DropdownMenuItem className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 cursor-pointer">
                                                <RiDashboardFill className="w-4 h-4 text-gray-400" />
                                                Trang quản lý
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to={`/user-profile/${keycloak?.tokenParsed?.preferred_username}?tab=savedPosts`}>
                                            <DropdownMenuItem className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 cursor-pointer">
                                                <CiBookmark className="w-4 h-4 text-gray-400" />
                                                Đã lưu
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to="/user-profile/settings">
                                            <DropdownMenuItem className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 cursor-pointer">
                                                <CiSettings className="w-4 h-4 text-gray-400" />
                                                Cài đặt tài khoản
                                            </DropdownMenuItem>
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-100 py-1.5">
                                        <DropdownMenuItem
                                            onClick={() => keycloak.logout()}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                                        >
                                            Đăng xuất
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => keycloak.login()}
                                className="text-sm font-medium text-gray-700 hover:text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100/60 transition-colors"
                            >
                                Đăng nhập
                            </button>
                            <Link
                                to="/user/register"
                                className="text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white px-4 py-1.5 rounded-full transition-colors shadow-sm"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}

                    {/* Mobile: notification + hamburger */}
                    <div className="flex sm:hidden items-center gap-1">
                        <Notification />
                        <button
                            onClick={() => setIsMobileMenuOpen(v => !v)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-amber-100 text-gray-700 transition-colors"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen
                                ? <IoMdClose className="text-xl" />
                                : <RiMenuLine className="text-xl" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile drawer ── */}
            {isMobileMenuOpen && (
                <div className="sm:hidden border-t border-[#e8d5c4] bg-[#f7f0e8]">

                    {/* Search */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center gap-2 bg-white border border-[#d4b896] rounded-full px-3 py-2.5 shadow-sm">
                            <CiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input
                                placeholder="Tìm kiếm bài viết, tác giả..."
                                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder:text-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const v = e.target.value.trim();
                                        if (v) { navigate(`/search?search_query=${v}&type=post&page=1`); closeMobileMenu(); }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Nav links */}
                    <nav className="px-4 flex flex-col border-t border-[#e8d5c4]/60 pt-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                to={href}
                                className="py-3 px-2 text-sm font-medium text-gray-700 border-b border-[#e8d5c4]/50 last:border-0 hover:text-amber-800 transition-colors"
                                onClick={closeMobileMenu}
                            >
                                {label}
                            </Link>
                        ))}
                        <Link
                            to="/post/create"
                            className="flex items-center gap-2 py-3 px-2 text-sm font-semibold text-amber-800 border-b border-[#e8d5c4]/50 transition-colors"
                            onClick={closeMobileMenu}
                        >
                            <RiQuillPenLine className="w-4 h-4" />
                            Viết bài
                        </Link>
                    </nav>

                    {/* Auth section */}
                    {initialized && (
                        <div className="px-4 py-3 border-t border-[#e8d5c4]/60">
                            {keycloak.authenticated ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm text-gray-900 truncate">{keycloak?.tokenParsed?.name}</p>
                                            <p className="text-xs text-gray-500">@{keycloak?.tokenParsed?.preferred_username}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            to={`/user-profile/${keycloak?.tokenParsed?.preferred_username}?tab=createdPosts`}
                                            className="text-center py-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full transition-colors"
                                            onClick={closeMobileMenu}
                                        >
                                            Trang cá nhân
                                        </Link>
                                        <button
                                            onClick={() => keycloak.logout()}
                                            className="text-center py-2 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-full transition-colors"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => keycloak.login()}
                                        className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Đăng nhập
                                    </button>
                                    <Link
                                        to="/user/register"
                                        className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-amber-700 rounded-full hover:bg-amber-800 transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
