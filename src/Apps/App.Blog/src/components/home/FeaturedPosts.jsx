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
        <div className='w-full py-6 border-t border-gray-100'>
            <div className='flex items-center justify-between mb-5'>
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                    <h2 className='font-bold text-lg tracking-wide text-gray-800'>NỔI BẬT TRONG THÁNG</h2>
                </div>
                <Link
                    to={`top-posts`}
                    className='text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 transition-colors'
                >
                    Xem TOP 10 bài viết →
                </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
                {data.map((p) => (
                    <PostListColCard key={p.postId} post={p} showAuthor={true} />
                ))}
            </div>
        </div>
    )
}

export default FeaturedPosts;