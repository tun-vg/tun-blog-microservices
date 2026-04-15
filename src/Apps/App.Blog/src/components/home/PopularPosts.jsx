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
        <>
            <div>
                <h1 className='font-bold text-lg'>PHỔ BIẾN TRÊN BLOG</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {favPost?.map(p => {
                        return <PostListCard key={p.postId} post={p} showAction={false} />
                    })}
                </div>
            </div>
        </>
    )
}

export default PopularPosts;