import { CiBookmark } from "react-icons/ci"
import Pagination from "../data-displays/Pagination/Pagination"
import { useEffect, useState } from "react"
import { getRecommendedPosts } from "../../api/post/post";
import { converteTimeToString } from "../../utils/handleTimeShow";

const RecommendedPosts = () => {
    const [data, setData] = useState([]);
    const getData = async () => {
        const result = await getRecommendedPosts();
        setData(result.items);
    }

    const [classification, setClassification] = useState(false);

    const changeClassification = (val) => {
        setClassification(val);
    }

    const [page, setPage] = useState(1);

    const changedPage = (page) => {
        console.log(page);
        setPage(page);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div className="py-5">
                <div className='flex gap-x-8'>
                    <div>
                        <div className={`${!classification ? ' font-bold' : ''} pl-2 pr-2 hover:cursor-pointer`} onClick={() => { changeClassification(false) }}>Dành cho bạn</div>
                        <div className={`${!classification ? 'bg-blue-500' : ''} h-1 w-full`}></div>
                    </div>
                    <div>
                        <div className={`${classification ? ' font-bold' : ''} pl-2 pr-2 hover:cursor-pointer`} onClick={() => { changeClassification(true) }}>Đánh giá cao nhất</div>
                        <div className={`${classification ? 'bg-blue-500' : ''} h-1 w-full`}></div>
                    </div>
                </div>
                <hr className='w-[65%]' />
                {data.map((p) => {
                    return <div key={p.postId} className='flex gap-x-4 mt-2 mb-2 bg-gray-50'>
                        <img src='/notebook.png' 
                            alt='image' 
                            className='h-36 w-52' 
                        />
                        <div className='flex flex-col gap-y-1 w-full justify-between'>
                            <div className=' flex justify-between items-center'>
                                <div className='flex gap-x-2 items-center'>
                                    <p className='font-light'>{p.categoryName}</p>
                                    <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                                    <p className='text-gray-400'>{p.readingTime} phút đọc</p>
                                </div>
                                <CiBookmark className='text-gray-400 h-5 w-5' />
                            </div>
                            <h2 className='font-semibold text-lg'>{p.title}</h2>
                            <p className='font-light'>{p.content}</p>
                            <div className='flex gap-x-2 items-center'>
                                <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-7 w-7 rounded-2xl' />
                                <h3 className='font-semibold'>{p.author}</h3>
                                <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                                <div className='text-gray-400'>{converteTimeToString(p.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                })}

                {/* Pagination */}
                <div>
                    <div>
                        <Pagination page={page} count={data.length} onPageChange={changedPage} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecommendedPosts;