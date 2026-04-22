import { useForm } from "react-hook-form";
import TextField from "../../components/form/TextField";
import { useKeycloak } from "@react-keycloak/web";
import { getUserInfoById, updateUser } from "../../api/user/user";
import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { uploadFile } from "../../api/file/file";
import { Textarea } from "@headlessui/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useUser } from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";

const UserProfileEditPage = () => {
    const { keycloak, initialized } = useKeycloak();
    const { userInfo, updateUserInfo } = useUser();
    const fileInputRef = useRef(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setUserAvatar(userInfo.avatarUrl);
        }
    }, [userInfo]);

    const { register, reset, control, handleSubmit, watch } = useForm({
        values: { 
            userName: userInfo?.userName || "",
            avatarUrl: userAvatar || "",
            email: userInfo?.email || "",
            firstName: userInfo?.firstName || "",
            lastName: userInfo?.lastName || "",
            description: userInfo?.description || "",
        }
    });
    
    const descriptionValue = watch("description") || "";
    const descriptionLength = descriptionValue.length;

    const triggerPickImage = () => fileInputRef.current?.click();


    const uploadFileToServer = async (file) => {
        try {

            const formData = new FormData();
            formData.append("file", file);
            const res = await uploadFile(formData);
            return res.url;
        }
        catch (error) {
            throw new Error(error);
        }
    };

    const onPickImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {

            setLoading(true);
            const url = await uploadFileToServer(file);
            // const url = await uploadFileByPresign(file);

            setUserAvatar(url);
        } catch (err) {
            console.error(err);
            alert("Upload ảnh thất bại");
        } finally {
            e.target.value = "";
            setLoading(false);
        }
    };

    const resetForm = () => {
        setUserAvatar(userInfo?.avatarUrl);
        reset({
            userName: userInfo?.userName,
            avatarUrl: userInfo?.avatarUrl,
            email: userInfo?.email,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            description: userInfo?.description,
        });
    }

    const handleEditUser = async (data) => {
        data.userId = userInfo?.userId;
        const response = await updateUser(data);
        updateUserInfo(response);
        toast.success("Cập nhật thông tin thành công!");
    }

    return <div className="container-app xl:px-[25%]">
        {/* nav bar */}
        <div
            className="fixed left-[20%]"
        >
            <div className="flex items-center gap-2 text-gray-500 font-semibold text-lg">
                <div className="w-[3px] h-9 bg-gray-500"></div>
                <span className="">Tài khoản</span>
            </div>
        </div>

        {/* Main page */}
        <div className="pl-[10%] flex flex-col gap-5">
            {/* Avatar - Des */}
            <form onSubmit={handleSubmit(handleEditUser)}>
                <div className="flex justify-between">
                    <div className="relative w-40 h-40 group cursor-pointer">
                        <img
                            src={`${userAvatar ? userAvatar : '/user.webp'}`}
                            className="rounded-full w-full h-full object-cover"
                            alt="Avatar"
                        />
                        <div
                            className={`
                                ${loading ? "absolute inset-0 bg-gray-300 flex items-center justify-center z-10 rounded-full opacity-100 transition-opacity duration-300" : "hidden"}
                            `}
                        >
                            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-500" />
                        </div>
                        <button
                            onClick={triggerPickImage}
                            type="button"
                            className="absolute inset-0 flex items-center justify-center z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <CiEdit className="text-white text-3xl font-bold" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onPickImage}
                        />

                        <input 
                            type="text"
                            className="hidden"
                            {...register("avatarUrl")}
                        />
                    </div>
                    <div
                        className="w-[60%] border-[1px] border-blue-200 rounded-md"
                    >
                        <div className="w-full h-full">
                            <Textarea
                                {...register("description")}
                                className="bg-blue-100 h-full w-full rounded-md"
                                maxLength={300}
                            />
                        </div>
                        <div className="pt-3">
                            <span className={descriptionLength >= 300 ? "text-red-500 font-bold" : ""}>
                                {descriptionLength}
                            </span>
                            /300
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-5 pt-10">
                    <TextField
                        name={"userName"}
                        control={control}
                        label={"User Name"}
                        // disabled={true}
                        readOnly={true}
                        className="border-gray-300 text-gray-500 pointer-events-none select-none read-only:focus:ring-0 read-only:focus:border-gray-300"
                    />

                    <TextField
                        name={"email"}
                        control={control}
                        label={"Email"}
                    />

                    <TextField
                        name={"firstName"}
                        control={control}
                        label={"First Name"}
                    />

                    <TextField
                        name={"lastName"}
                        control={control}
                        label={"Last Name"}
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <buton
                        className="w-fit py-3 px-6 hover:bg-gray-100 rounded-3xl"
                        onClick={() => resetForm()}
                    >
                        Hủy
                    </buton>
{/* 
                    <buton
                        className="w-fit py-3 px-6 bg-blue-300 hover:bg-blue-400 rounded-3xl text-white"
                    >
                        Lưu
                    </buton> */}
                    <input
                        type="submit"
                        value="Lưu"
                        className="w-fit py-3 px-6 bg-blue-300 hover:bg-blue-400 rounded-3xl text-white"
                    />
                </div>
            </form>
        </div>
        <ToastContainer />
    </div>
}

export default UserProfileEditPage;