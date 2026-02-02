import { useEffect, useState } from "react";
import { getFeaturedPosts } from "../../api/post/post";
import { CiBookmark } from "react-icons/ci";

const FeaturedPosts = () => {
    const [data, setData] = useState([]);

    const getDataAsync = async () => {
        const result = await getFeaturedPosts();
        setData(result.items);
    }

    const [isTopMonth, setIsTopMonth] = useState(true);

    const changeSelectTopMonth = (val) => {
        setIsTopMonth(val);
    }

    useEffect(() => {
        getDataAsync();
    }, [])

    return (
        <>
            <div className='w-full py-5'>
                <div className='flex gap-x-5'>
                    <div className={`${isTopMonth ? 'font-bold' : ''}` + ' hover:cursor-pointer'} onClick={() => changeSelectTopMonth(true)}>NỔI BẬT TRONG THÁNG</div>
                    <div className='w-[2px] bg-gray-300'></div>
                    <div className={`${!isTopMonth ? 'font-bold' : ''}` + ' hover:cursor-pointer'} onClick={() => changeSelectTopMonth(false)}>Xem TOP 10 bài viết</div>
                </div>

                <div className='grid grid-cols-4 gap-x-5 mt-2'>
                    {data.map((p) => {
                        return <div key={p.postId} className='h-fit flex flex-col gap-y-3 bg-gray-300'>
                            <img src='/notebook.png' 
                                alt='image' 
                                className='h-36 w-full rounded-lg' 
                            />
                            <div className='flex justify-between items-center'>
                                <p className='text-gray-400'>{p.timeReade} phút đọc</p>
                                <CiBookmark className='h-5 w-5 text-gray-400' />
                            </div>
                            <p>{p.title}</p>
                            <div className='flex items-center gap-x-3'>
                                <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-7 w-7 rounded-2xl' />
                                <div className='h-1 w-1 bg-gray-400 rounded-md'></div>
                                <div className='text-gray-400'>17 Th6</div>
                            </div>
                        </div>
                    })}

                </div>
            </div>
        </>
    )
}

export default FeaturedPosts;