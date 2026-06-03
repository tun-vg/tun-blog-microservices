import { BsEye } from "react-icons/bs";
import { extractFirstImage } from "../../utils/content";
import { converteTimeToString } from "../../utils/handleTimeShow";
import { Link } from "react-router-dom";

const PostListColCard = ({ post, showAuthor = true }) => {
    const image = extractFirstImage(post.content);

    return <Link to={`/post/${post.postId}/${post.slug}`} className="group">
        <div className='flex flex-col rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white h-full'>
            <div className="overflow-hidden h-44">
                {image ? (
                    <img
                        src={image}
                        alt='image'
                        className='h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                ) : (
                    <div className="h-44 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <span className="text-amber-300 text-4xl">✦</span>
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-y-2 p-3 flex-1'>
                <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5'>
                        {post.readingTime} phút đọc
                    </span>
                    <span className="flex gap-1 items-center text-gray-400 text-xs">
                        <BsEye />
                        {post.viewCount}
                    </span>
                </div>
                <p className="font-semibold text-sm leading-snug text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-3">
                    {post.title}
                </p>
                <div className='flex items-center gap-x-2 mt-auto pt-1'>
                    {showAuthor ? (
                        <>
                            <img
                                src={post.authorAvatar ? post.authorAvatar : '/user.webp'}
                                alt='avatar'
                                className='h-6 w-6 rounded-full object-cover ring-1 ring-white shadow-sm'
                            />
                            <span className='text-gray-400 text-xs'>{converteTimeToString(post.createdAt)}</span>
                        </>
                    ) : (
                        <span className='text-gray-400 text-xs'>{converteTimeToString(post.createdAt)}</span>
                    )}
                </div>
            </div>
        </div>
    </Link>
}

export default PostListColCard;