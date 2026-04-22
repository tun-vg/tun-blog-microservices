import { useForm } from "react-hook-form";
import TextField from "../../components/form/TextField";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { Textarea } from "@headlessui/react";
import Editor from "../../components/form/Editor";
import { addPost } from "../../api/post/post";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { getCategories } from "../../api/category/category";
import { getTagsByCategoryId } from "../../api/tag/tag";
import useAuthGuard from "../../utils/useAuthGuard";
import { getUserInfoById } from "../../api/user/user";
import { set } from "date-fns";

const CreatePostPage = () => {
    const [html, setHtml] = useState("<p>Nhập nội dung...</p>");

    const { handleSubmit, reset, control, register } = useForm();

    const { keycloak, initialized } = useKeycloak();
    const { requiredLogin } = useAuthGuard();
    const [authorInfo, setAuthorInfo] = useState();

    const fetchAuthorInfo = async (userId) => {
        var response = await getUserInfoById(userId);
        setAuthorInfo(response);
    }

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchAuthorInfo(keycloak.tokenParsed.sub);
        }
    }, [initialized, keycloak]);

    const onSubmit = async (data) => {
        if (!requiredLogin()){
            return;
        }
        data.Content = html;
        data.categoryId = selectedCategory.categoryId;
        data.postTags = dataTagsSelected;
        data.userName = authorInfo?.userName;
        data.email = authorInfo?.email;
        data.firstName = authorInfo?.firstName;
        data.lastName = authorInfo?.lastName;
        data.avatarUrl = authorInfo?.avatarUrl;
        
        const result = await addPost(data);
        
        if (result.isSuccess) {
            toast("Add Post Successfully!");
        }
    }

    const [openSelectCategory, setOpenSelectCategory] = useState(false);
    const [dataCategories, setDataCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dataTags, setDataTags] = useState([]);
    const [dataTagsSelected, setDataTagsSelected] = useState([]);
    const [isDoneSelectCate, setIsDoneSelectCate] = useState(false);

    const getDataCategories = async () => {
        const result = await getCategories();
        setDataCategories(result.items);
    }

    const changeSelectedCategory = async (category) => {
        setSelectedCategory(category);
        const result = await getTagsByCategoryId(category.categoryId);
        setDataTags(result.items);
        setDataTagsSelected([]);
    }

    useEffect(() => {
        getDataCategories();
    }, [])

    const handleSelectedTag = (tag) => {
        let selectedTags = [...dataTagsSelected, tag];
        setDataTagsSelected(selectedTags);

        let tags = dataTags.filter(t => t !== tag);
        setDataTags(tags);
    }

    const handleUnselectedTag = (tag) => {
        let updatedTags = dataTagsSelected.filter(t => t !== tag);
        setDataTagsSelected(updatedTags);

        let tags = [...dataTags, tag];
        setDataTags(tags);
    }

    return (
        <>
            <div className="container-app">
                <h1 className="font-bold text-2xl">Tạo bài viết mới</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register('AuthorId')} value='a6b82feb-d839-40bc-af00-7b3e6ffd1002' />
                    <div className="mt-3">
                        <label className="font-medium text-gray-700">Chọn chủ đề </label>
                        <br />
                        {(!openSelectCategory && !isDoneSelectCate) && <button
                            className="border-dashed border-[1px] border-gray-600 rounded-3xl py-2 px-3 mt-1 flex gap-1 justify-center items-center"
                            onClick={() => setOpenSelectCategory(true)}
                        >
                            <FaPlus /> Thêm chủ đề
                        </button>
                        }
                    </div>

                    {openSelectCategory && <div className="border-[1px] border-gray-300 rounded-md shadow-lg min-h-[250px] relative">
                        <div className="flex gap-2 mb-[60px] h-full">
                            <div className="w-[30%] bg-gray-50 min-h-[190px]">
                                <h2 className="p-2 font-semibold">Danh sách chủ đề:</h2>
                                <div className="overflow-auto">
                                    {dataCategories.map((e) => {
                                        return <div
                                            key={e.categoryId}
                                            onClick={() => changeSelectedCategory(e)}
                                            className={`hover:bg-gray-100 py-1 px-4 ${selectedCategory?.categoryId == e?.categoryId ? 'bg-gray-300 hover:bg-gray-300' : ''}`}
                                        >
                                            {e.name}
                                        </div>
                                    })}
                                </div>
                            </div>
                            {/* <div className="w-[2px] h-auto bg-gray-400"></div> */}
                            <div className="w-[35%] p-2 bg-gray-50 min-h-[190px]">
                                <h2 className="font-semibold">Danh sách tag:</h2>
                                <div>
                                    {dataTags.map((e) => {
                                        return <button
                                            key={e.tagId}
                                            className="w-fit border-[1px] border-gray-400 rounded-3xl py-1 px-2 mx-2 my-1"
                                            onClick={() => handleSelectedTag(e)}
                                        >
                                            + {e.name}
                                        </button>
                                    })}
                                </div>
                            </div>
                            {/* <div className="w-[2px] h-auto bg-gray-400"></div> */}
                            <div className="w-[35%] p-2 bg-gray-50 min-h-[190px]">
                                <h2 className="font-semibold">Các tag đã chọn:</h2>
                                <div>
                                    {dataTagsSelected.map((e) => {
                                        return <button
                                            key={e.tagId}
                                            className="w-fit border-[1px] border-gray-400 rounded-3xl py-1 px-2 mx-2 my-1"
                                            onClick={() => handleUnselectedTag(e)}
                                        >
                                            ✔ {e.name}
                                        </button>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-0 bottom-0 w-full">
                            <div className="h-[2px] bg-gray-400 w-full"></div>
                            <div className="flex justify-end gap-4 p-2">
                                <button
                                    className="border-[1px] rounded-md border-gray-300 py-2 px-4 font-medium"
                                    onClick={() => setOpenSelectCategory(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="border-[1px] rounded-md border-gray-300 bg-blue-500 py-2 px-4 text-white font-medium"
                                    onClick={() => {
                                        setIsDoneSelectCate(true);
                                        setOpenSelectCategory(false)
                                    }}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                    }

                    {isDoneSelectCate && <div className="border-[1px] border-gray-300 rounded-md p-2 shadow-lg grid grid-rows-2 gap-2">
                        <div>
                            <h2 className="font-semibold">Chủ đề đã được chọn:</h2>
                            <div
                                className="w-fit border-[1px] border-gray-400 rounded-3xl py-1 px-2 mx-2 my-1"
                                onClick={() => {
                                    setOpenSelectCategory(true);
                                    setIsDoneSelectCate(false);
                                }}
                            >
                                {selectedCategory?.name}
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold">Các tag đã được chọn:</h2>
                            <div>
                                {dataTagsSelected.map((e) => {
                                    return <button
                                        key={e.tagId}
                                        className="w-fit border-[1px] border-gray-400 rounded-3xl py-1 px-2 mx-2 my-1"
                                        onClick={() => {
                                            setOpenSelectCategory(true);
                                            setIsDoneSelectCate(false);
                                        }}
                                    >
                                        {e.name}
                                    </button>
                                })}
                            </div>
                        </div>
                    </div>
                    }

                    <TextField
                        name='Title'
                        label='Tiều đề'
                        control={control}
                        className="mt-3"
                    />

                    <Editor onChange={setHtml} className='h-full' />

                    <div className="flex justify-center mt-3">
                        <input type="submit" value="Tạo" className="bg-blue-500 text-white font-bold px-5 py-2 rounded-md" />
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default CreatePostPage;