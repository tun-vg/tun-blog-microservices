import { useEffect, useState } from "react";
import { getPostsTrending } from "../../api/post/post";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import PostListCard from "../ui/PostListCard";

const PopularPosts = () => {
    const [favPost, setFavPost] = useState([]);

    const getFavPost = async () => {
        const result = await getPostsTrending();
        setFavPost(result.items);
    }

    let navigate = useNavigate();

    useEffect(() => {
        getFavPost();
    }, []);

    return (
        <div className="py-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                <h1 className='font-bold text-lg tracking-wide text-gray-800'>PHỔ BIẾN TRÊN BLOG</h1>
            </div>
            <div className='grid 2xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-3'>
                {favPost?.map(p => (
                    <PostListCard key={p.postId} post={p} showAction={false} />
                ))}
            </div>
        </div>
    )
}

export default PopularPosts;