import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchPost } from "../../api/post/post";

import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FiTag } from "react-icons/fi";
import { BsCaretUp } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";

const SearchPostPage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const searchValue = searchParams.get('search_query');
    const type = searchParams.get('type');
    const page = searchParams.get('page');

    const navigate = useNavigate();

    const search = async () => {
        const result = await searchPost(searchValue, type, page, 10);
        setData(result.items);
    }

    useEffect(() => {
        search();
        console.log(data);
    }, [type, searchValue])

    return (
        <>
            <div className="container-app">
                <h1 className="font-bold text-center mb-5 text-2xl">Kết quả tìm kiếm: <i>"{searchValue}"</i></h1>
                <div className="border-[1px] border-gray-200 rounded-[4px] p-10">
                    <div className="flex justify-between">
                        <div
                            className="w-1/3 group cursor-pointer"
                            onClick={() => navigate(`/search?search_query=${searchValue}&type=post&page=1`)}
                        >
                            <div className={`grid grid-flow-col items-center gap-1 justify-center font-bold ${type === 'post' ? 'text-blue-500' : ''}`}>
                                <IoDocumentTextOutline />
                                Bài viết
                            </div>
                            <div
                                className={`
                                    h-1 w-full transition-colors duration-200
                                    ${type === 'post' ? 'bg-blue-500' : 'bg-transparent group-hover:bg-gray-300'}
                                `}
                            />
                        </div>

                        <div
                            className="w-1/3 group cursor-pointer"
                            onClick={() => navigate(`/search?search_query=${searchValue}&type=user&page=1`)}
                        >
                            <div className={`grid grid-flow-col items-center gap-1 justify-center font-bold ${type === 'user' ? 'text-blue-500' : ''}`}>
                                <FaRegUser />
                                Người dùng
                            </div>
                            <div
                                className={`
                                    h-1 w-full transition-colors duration-200
                                    ${type === 'user' ? 'bg-blue-500' : 'bg-transparent group-hover:bg-gray-300'}
                                `}
                            />
                        </div>

                        <div
                            className="w-1/3 group cursor-pointer"
                            onClick={() => navigate(`/search?search_query=${searchValue}&type=tag&page=1`)}
                        >
                            <div className={`grid grid-flow-col items-center gap-1 justify-center font-bold ${type === 'tag' ? 'text-blue-500' : ''}`}>
                                <FiTag />
                                Tag
                            </div>
                            <div
                                className={`
                                    h-1 w-full transition-colors duration-200
                                    ${type === 'tag' ? 'bg-blue-500' : 'bg-transparent group-hover:bg-gray-300'}
                                `}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="h-fit">
                        {data !== null && type !== "user" && data.map((p) => {
                            return <div key={p.postId}
                                className='flex gap-x-4 mt-2 mb-2 bg-gray-300'
                                onClick={() => navigate(`/post/${p.postId}/${p.slug}`)}>
                                <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='image' className='h-36 w-52' />
                                <div className='flex flex-col gap-y-1 w-full justify-between'>
                                    <div className=' flex justify-between items-center'>
                                        <div className='flex gap-x-2 items-center'>
                                            <p className='font-light'>{p.category} Thể thao</p>
                                            <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                                            <p className='text-gray-400'>{p.readingTime} phút đọc</p>
                                        </div>

                                    </div>
                                    <h2 className='font-semibold text-lg'>{p.title}</h2>
                                    <p className='font-light'>{p.content}</p>
                                    <div className="flex justify-between">
                                        <div className='flex gap-x-2 items-center'>
                                            <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-7 w-7 rounded-2xl' />
                                            <h3 className='font-semibold'>{p.author}</h3>
                                            <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                                            <div className='text-gray-400'>Hôm qua</div>
                                        </div>
                                        <div className="flex gap-6">
                                            <span className="flex gap-1 items-center">
                                                <BsCaretUp className="text-2xl" />
                                                {p.upPoint}
                                            </span>
                                            <span className="flex gap-1 items-center">
                                                <FaRegEye className="text-xl pt-[1px]" />
                                                {p.viewCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}

                        {data !== null && type === "user" && (
                            data.map((u) => {
                                return <div 
                                        className="flex justify-center my-3"
                                        onClick={() => navigate(`/user-profile/${u.userName}`)}
                                >                                
                                    <div className="w-1/2 border-[1px] rounded-[4px] border-gray-200 p-5">
                                        <div className="flex gap-2 justify-start items-center">
                                            <div>
                                                <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='image' className='h-10 w-10 rounded-full' />
                                            </div>
                                            <div className="flex flex-col items-start justify-center">
                                                <span>@{u.userName}</span>
                                                <span>{u.firstName} {u.lastName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchPostPage;