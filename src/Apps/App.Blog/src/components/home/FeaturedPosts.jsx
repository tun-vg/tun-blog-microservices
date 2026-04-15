import { useEffect, useState } from "react";
import { getFeaturedPosts } from "../../api/post/post";
import { CiBookmark } from "react-icons/ci";
import { converteTimeToString } from "../../utils/handleTimeShow";
import PostListColCard from "../ui/PostListColCard";
import { Link } from "react-router-dom";

const FeaturedPosts = () => {
    const [data, setData] = useState([]);

    const getDataAsync = async () => {
        const result = await getFeaturedPosts();
        setData(result.items);
    }

    useEffect(() => {
        getDataAsync();
    }, [])

    return (
        <>
            <div className='w-full py-5'>
                <div className='flex gap-x-5'>
                    <div className='font-bold hover:cursor-pointer'>NỔI BẬT TRONG THÁNG</div>
                    <div className='w-[2px] bg-gray-300'></div>
                    <Link 
                        to={`top-posts`}
                        className='text-gray-600 hover:cursor-pointer'
                    >
                        Xem TOP 10 bài viết
                    </Link>
                </div>

                <div className='grid grid-cols-4 gap-x-7 mt-2'>
                    {data.map((p) => {
                        return <PostListColCard key={p.postId} post={p} showAuthor={true} />
                    })}

                </div>
            </div>
        </>
    )
}

export default FeaturedPosts;