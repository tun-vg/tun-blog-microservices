import { useForm } from "react-hook-form";
import { useKeycloak } from "@react-keycloak/web";
import { updateUser } from "../../api/user/user";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "../../api/file/file";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useUser } from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CiCamera, CiLock } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { FiUser, FiMail, FiFileText, FiCheck } from "react-icons/fi";
import { BsPersonBadge } from "react-icons/bs";

const SIDEBAR_ITEMS = [
    { id: "profile", label: "Hồ sơ cá nhân", icon: <FiUser /> },
];

const UserProfileEditPage = () => {
    const { keycloak, initialized } = useKeycloak();
    const { userInfo, updateUserInfo } = useUser();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState("profile");

    useEffect(() => {
        if (userInfo) setUserAvatar(userInfo.avatarUrl);
    }, [userInfo]);

    const { register, reset, control, handleSubmit, watch } = useForm({
        values: {
            userName:    userInfo?.userName    || "",
            avatarUrl:   userAvatar            || "",
            email:       userInfo?.email       || "",
            firstName:   userInfo?.firstName   || "",
            lastName:    userInfo?.lastName    || "",
            description: userInfo?.description || "",
        },
    });

    const descriptionValue = watch("description") || "";
    const descriptionLength = descriptionValue.length;
    const MAX_BIO = 300;

    // ── Avatar upload ──
    const onPickImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadFile(formData);
            setUserAvatar(res.url);
        } catch {
            toast.error("Upload ảnh thất bại. Vui lòng thử lại.");
        } finally {
            e.target.value = "";
            setUploading(false);
        }
    };

    const resetForm = () => {
        setUserAvatar(userInfo?.avatarUrl);
        reset({
            userName:    userInfo?.userName,
            avatarUrl:   userInfo?.avatarUrl,
            email:       userInfo?.email,
            firstName:   userInfo?.firstName,
            lastName:    userInfo?.lastName,
            description: userInfo?.description,
        });
    };

    const handleEditUser = async (data) => {
        setSaving(true);
        try {
            data.userId   = userInfo?.userId;
            data.avatarUrl = userAvatar;
            const response = await updateUser(data);
            updateUserInfo(response);
            toast.success("Cập nhật thông tin thành công!");
        } catch {
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-app !pt-6 !pb-16">

                {/* Back link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 mb-6 transition-colors group"
                >
                    <IoIosArrowBack className="text-base group-hover:-translate-x-0.5 transition-transform" />
                    Quay lại
                </button>

                <div className="flex flex-col md:flex-row gap-6">

                    {/* ════ LEFT: sidebar nav ════ */}
                    <aside className="w-full md:w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-4 py-4 border-b border-gray-100">
                                <h2 className="font-bold text-gray-800 text-base">Cài đặt</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Quản lý tài khoản của bạn</p>
                            </div>
                            <nav className="py-2">
                                {SIDEBAR_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                                            activeSection === item.id
                                                ? "text-amber-700 bg-amber-50"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <span className={`text-base ${activeSection === item.id ? "text-amber-500" : "text-gray-400"}`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                        {activeSection === item.id && (
                                            <span className="ml-auto w-1 h-4 bg-amber-500 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Profile link */}
                        {userInfo?.userName && (
                            <Link
                                to={`/user-profile/${userInfo.userName}`}
                                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-gray-500 hover:text-amber-700 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-xl transition-all"
                            >
                                <BsPersonBadge className="text-sm" />
                                Xem trang cá nhân
                            </Link>
                        )}
                    </aside>

                    {/* ════ RIGHT: form card ════ */}
                    <div className="flex-1 min-w-0">
                        <form onSubmit={handleSubmit(handleEditUser)}>
                            <div className="flex flex-col gap-5">

                                {/* ── Card: Avatar & Bio ── */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                    <h3 className="font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                                        <FiUser className="text-amber-500" />
                                        Ảnh đại diện & Giới thiệu
                                    </h3>

                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Avatar */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                {/* Ring decoration */}
                                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 p-0.5 shadow-md">
                                                    <img
                                                        src={userAvatar || '/user.webp'}
                                                        alt="Avatar"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>

                                                {/* Upload loading overlay */}
                                                {uploading && (
                                                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                                                        <AiOutlineLoading3Quarters className="animate-spin text-white text-2xl" />
                                                    </div>
                                                )}

                                                {/* Hover overlay */}
                                                {!uploading && (
                                                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
                                                        <CiCamera className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                    </div>
                                                )}

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={onPickImage}
                                                />
                                                {/* Hidden field for form */}
                                                <input type="hidden" {...register("avatarUrl")} value={userAvatar || ""} />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-xs text-amber-600 hover:text-amber-800 font-medium underline underline-offset-2"
                                            >
                                                Thay đổi ảnh
                                            </button>
                                            <p className="text-xs text-gray-400 text-center max-w-[110px] leading-relaxed">
                                                JPG, PNG tối đa 5MB
                                            </p>
                                        </div>

                                        {/* Bio textarea */}
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                <FiFileText className="text-gray-400 text-sm" />
                                                Giới thiệu bản thân
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    {...register("description")}
                                                    maxLength={MAX_BIO}
                                                    rows={5}
                                                    placeholder="Viết vài dòng giới thiệu về bạn..."
                                                    className="w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 resize-none placeholder:text-gray-400 transition-all"
                                                />
                                                <div className="absolute bottom-2.5 right-3 text-xs">
                                                    <span className={descriptionLength >= MAX_BIO ? "text-red-500 font-semibold" : "text-gray-400"}>
                                                        {descriptionLength}
                                                    </span>
                                                    <span className="text-gray-300">/{MAX_BIO}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Card: Personal Info ── */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                    <h3 className="font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                                        <FiMail className="text-amber-500" />
                                        Thông tin cá nhân
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        {/* Username — read only */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                                                Tên người dùng
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-normal">
                                                    <CiLock className="text-xs" />
                                                    Không thể đổi
                                                </span>
                                            </label>
                                            <input
                                                {...register("userName")}
                                                readOnly
                                                className="w-full px-3 py-2.5 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed select-none focus:outline-none"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                {...register("email")}
                                                type="email"
                                                placeholder="email@example.com"
                                                className="w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* First name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Họ
                                            </label>
                                            <input
                                                {...register("firstName")}
                                                placeholder="Nguyễn"
                                                className="w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* Last name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Tên
                                            </label>
                                            <input
                                                {...register("lastName")}
                                                placeholder="Văn A"
                                                className="w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Action bar ── */}
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy thay đổi
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm disabled:opacity-60"
                                    >
                                        {saving
                                            ? <AiOutlineLoading3Quarters className="animate-spin text-base" />
                                            : <FiCheck className="text-base" />
                                        }
                                        Lưu thay đổi
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default UserProfileEditPage;
