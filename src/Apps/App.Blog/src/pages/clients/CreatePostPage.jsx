import { useForm } from "react-hook-form";
import TextField from "../../components/form/TextField";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import Editor from "../../components/form/Editor";
import { addPost } from "../../api/post/post";
import { ToastContainer, toast } from "react-toastify";
import { getCategories } from "../../api/category/category";
import { getTagsByCategoryId } from "../../api/tag/tag";
import useAuthGuard from "../../utils/useAuthGuard";
import { getUserInfoById } from "../../api/user/user";
import { IoIosArrowBack } from "react-icons/io";
import { FiTag, FiEdit3, FiCheck, FiX } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsSave } from "react-icons/bs";

const CreatePostPage = () => {
    const [html, setHtml] = useState("");
    const { handleSubmit, reset, control, register, getValues } = useForm();
    const { keycloak, initialized } = useKeycloak();
    const { requireLogin } = useAuthGuard();
    const [authorInfo, setAuthorInfo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    const fetchAuthorInfo = async (userId) => {
        const response = await getUserInfoById(userId);
        setAuthorInfo(response);
    };

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchAuthorInfo(keycloak.tokenParsed.sub);
        }
    }, [initialized, keycloak]);

    const buildPayload = (data, status) => ({
        ...data,
        authorId: authorInfo?.userId,
        Content: html,
        categoryId: selectedCategory?.categoryId,
        postTags: dataTagsSelected,
        userName: authorInfo?.userName,
        email: authorInfo?.email,
        firstName: authorInfo?.firstName,
        lastName: authorInfo?.lastName,
        avatarUrl: authorInfo?.avatarUrl,
        status,
    });

    const onSubmit = async (data) => {
        if (!requireLogin()) return;
        setIsSubmitting(true);
        try {
            const result = await addPost(buildPayload(data, 1));
            if (result.isSuccess) toast.success("Đăng bài thành công!");
        } catch {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveDraft = async () => {
        if (!requireLogin()) return;
        setIsSavingDraft(true);
        try {
            const data = getValues();
            const result = await addPost(buildPayload(data, 0));
            if (result.isSuccess) toast.success("Đã lưu nháp!");
        } catch {
            toast.error("Lưu nháp thất bại.");
        } finally {
            setIsSavingDraft(false);
        }
    };

    // Category & tag state
    const [panelOpen, setPanelOpen]           = useState(false);
    const [confirmed, setConfirmed]           = useState(false);
    const [dataCategories, setDataCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dataTags, setDataTags]             = useState([]);
    const [dataTagsSelected, setDataTagsSelected] = useState([]);

    useEffect(() => {
        getCategories().then(r => setDataCategories(r.items));
    }, []);

    const pickCategory = async (cat) => {
        setSelectedCategory(cat);
        const r = await getTagsByCategoryId(cat.categoryId);
        setDataTags(r.items);
        setDataTagsSelected([]);
    };

    const addTag = (tag) => {
        setDataTagsSelected(p => [...p, tag]);
        setDataTags(p => p.filter(t => t !== tag));
    };

    const removeTag = (tag) => {
        setDataTagsSelected(p => p.filter(t => t !== tag));
        setDataTags(p => [...p, tag]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors flex-shrink-0"
                        >
                            <IoIosArrowBack className="text-xl" />
                        </button>
                        <div>
                            <h1 className="font-bold text-xl sm:text-2xl text-gray-900 flex items-center gap-2">
                                <FiEdit3 className="text-amber-500" />
                                Tạo bài viết mới
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">Chia sẻ kiến thức và câu chuyện của bạn</p>
                        </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 pl-12 sm:pl-0">
                        <button
                            type="button"
                            onClick={saveDraft}
                            disabled={isSavingDraft}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {isSavingDraft
                                ? <AiOutlineLoading3Quarters className="animate-spin" />
                                : <BsSave />
                            }
                            Lưu nháp
                        </button>
                        <button
                            form="create-post-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {isSubmitting
                                ? <AiOutlineLoading3Quarters className="animate-spin" />
                                : <FiCheck />
                            }
                            Đăng bài
                        </button>
                    </div>
                </div>

                <form id="create-post-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                    {/* ── Title ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề bài viết</label>
                        <TextField
                            name="Title"
                            control={control}
                            className="w-full text-xl font-semibold border-0 focus:ring-0 placeholder-gray-300"
                            placeholder="Nhập tiêu đề hấp dẫn..."
                        />
                    </div>

                    {/* ── Category & Tags ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                        <div className="flex items-center gap-2 mb-3">
                            <FiTag className="text-amber-500" />
                            <span className="text-sm font-semibold text-gray-700">Chủ đề & Thẻ</span>
                        </div>

                        {/* Summary row (when confirmed) */}
                        {confirmed && !panelOpen && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full border border-amber-200">
                                    {selectedCategory?.name}
                                </span>
                                {dataTagsSelected.map(t => (
                                    <span key={t.tagId} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                                        #{t.tagName}
                                        <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-red-400 ml-0.5">
                                            <FiX className="text-xs" />
                                        </button>
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => { setPanelOpen(true); setConfirmed(false); }}
                                    className="text-xs text-amber-600 hover:text-amber-800 font-medium underline"
                                >
                                    Thay đổi
                                </button>
                            </div>
                        )}

                        {/* Open panel button */}
                        {!confirmed && !panelOpen && (
                            <button
                                type="button"
                                onClick={() => setPanelOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-400 hover:text-amber-600 text-sm transition-colors"
                            >
                                <FiTag /> Chọn chủ đề và thẻ
                            </button>
                        )}

                        {/* Selection panel */}
                        {panelOpen && (
                            <div className="border border-gray-200 rounded-xl overflow-hidden mt-1">
                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-gray-50 min-h-[200px]">
                                    {/* Categories */}
                                    <div>
                                        <div className="px-4 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">Chủ đề</div>
                                        <div className="overflow-y-auto max-h-52">
                                            {dataCategories.map(cat => (
                                                <div
                                                    key={cat.categoryId}
                                                    onClick={() => pickCategory(cat)}
                                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                                                        ${selectedCategory?.categoryId === cat.categoryId
                                                            ? 'bg-amber-50 text-amber-700 font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    {cat.name}
                                                    {selectedCategory?.categoryId === cat.categoryId && <FiCheck className="text-amber-500 text-xs" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Available tags */}
                                    <div>
                                        <div className="px-4 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">Thẻ có sẵn</div>
                                        <div className="p-3 flex flex-wrap gap-2">
                                            {dataTags.length === 0 && (
                                                <span className="text-xs text-gray-400">{selectedCategory ? "Không có thẻ" : "Chọn chủ đề trước"}</span>
                                            )}
                                            {dataTags.map(t => (
                                                <button
                                                    key={t.tagId}
                                                    type="button"
                                                    onClick={() => addTag(t)}
                                                    className="text-xs bg-white border border-gray-300 text-gray-600 px-2.5 py-1 rounded-full hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                                >
                                                    + {t.tagName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selected tags */}
                                    <div>
                                        <div className="px-4 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">Đã chọn ({dataTagsSelected.length})</div>
                                        <div className="p-3 flex flex-wrap gap-2">
                                            {dataTagsSelected.map(t => (
                                                <button
                                                    key={t.tagId}
                                                    type="button"
                                                    onClick={() => removeTag(t)}
                                                    className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors flex items-center gap-1"
                                                >
                                                    ✓ {t.tagName} <FiX className="text-xs" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Panel footer */}
                                <div className="flex justify-end gap-3 px-4 py-3 bg-white border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setPanelOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!selectedCategory}
                                        onClick={() => { setConfirmed(true); setPanelOpen(false); }}
                                        className="px-5 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Editor ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <FiEdit3 className="text-amber-500 text-sm" />
                            <span className="text-sm font-semibold text-gray-700">Nội dung bài viết</span>
                        </div>
                        <Editor onChange={setHtml} content={html} />
                    </div>

                    {/* ── Bottom action bar (mobile-friendly) ── */}
                    <div className="flex justify-end gap-3 pb-6">
                        <button
                            type="button"
                            onClick={saveDraft}
                            disabled={isSavingDraft}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {isSavingDraft ? <AiOutlineLoading3Quarters className="animate-spin" /> : <BsSave />}
                            Lưu nháp
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {isSubmitting ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FiCheck />}
                            Đăng bài
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CreatePostPage;
