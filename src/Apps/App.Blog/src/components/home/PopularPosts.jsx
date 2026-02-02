import { useEffect, useState } from "react";
import { getPostsTrending } from "../../api/post/post";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const PopularPosts = () => {
    const [favPost, setFavPost] = useState([]);

    const getFavPost = async () => {
        const result = await getPostsTrending();
        setFavPost(result.items);
    }

    let navigate = useNavigate();

    useEffect(() => {
        getFavPost();
    }, [])
    return (
        <>
            <div>
                <h1 className='font-bold text-lg'>PHỔ BIẾN TRÊN BLOG</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {favPost?.map(p => {
                        return <div key={p.postId} className='flex gap-x-4 mt-2 mb-2 bg-gray-300' onClick={() => navigate(`/post/${p.postId}/${p.slug}`)}>
                            <img src='/notebook.png' 
                                alt='image' 
                                className='h-28 w-28' 
                            />
                            <div className='flex flex-col gap-y-1 w-full justify-between'>
                                <div className=' flex justify-between items-center'>
                                    <div className='flex gap-x-2 items-center'>
                                        <p className='font-light text-base'>{p.category}</p>
                                        <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                                        <p className='text-gray-400'>{p.readingTime} phút đọc</p>
                                    </div>
                                    <CiBookmark className='text-gray-400' />
                                </div>
                                <h2 className='font-semibold'>{p.title}</h2>
                                <p className='font-light text-sm'>{p.content}</p>
                                <div className='flex gap-x-2 items-center'>
                                    <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-7 w-7 rounded-2xl' />
                                    <h3 className='font-semibold'>{p.author}</h3>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default PopularPosts;