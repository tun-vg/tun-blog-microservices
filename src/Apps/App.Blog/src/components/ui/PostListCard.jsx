import { Link } from "react-router-dom";
import { extractFirstImage, getPreviewContent } from "../../utils/content";
import { converteTimeToString } from "../../utils/handleTimeShow";
import { BsCaretUp } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa6";
import { GoComment } from "react-icons/go";

const PostListCard = ({ post, showAction = true }) => {
    const image = extractFirstImage(post.content);

    return <Link
        className='group flex flex-col sm:flex-row sm:gap-x-3 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-white overflow-hidden min-w-0'
        to={`/post/${post.postId}/${post.slug}`}
    >
        {/* Ảnh: full-width trên mobile, cố định trên sm+ */}
        {image && (
            <div className="overflow-hidden sm:flex-shrink-0 sm:rounded-lg sm:m-3 sm:mr-0">
                <img
                    src={image}
                    alt=""
                    className="w-full h-44 sm:h-[140px] sm:w-[200px] sm:rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
        )}

        <div className='flex flex-col gap-y-2 p-3 justify-between min-w-0 flex-1'>
            <div className='flex gap-x-2 items-center'>
                {post.categoryName && (
                    <span className='text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full'>
                        {post.categoryName}
                    </span>
                )}
                <span className='text-gray-400 text-xs'>{post.readingTime} phút đọc</span>
            </div>

            <div className='font-bold text-[15px] sm:text-[17px] leading-snug text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2 break-words overflow-hidden'>
                {post.title}
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 break-words overflow-hidden">
                {getPreviewContent(post.content, 120)}
            </p>

            {showAction ? (
                <div className="flex justify-between items-center flex-wrap gap-1">
                    <div className='flex gap-x-2 items-center min-w-0'>
                        <img
                            src={post.authorAvatar ? post.authorAvatar : '/user.webp'}
                            alt='avatar'
                            className='h-7 w-7 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0'
                        />
                        <span className='font-medium text-sm text-gray-700 truncate max-w-[120px] sm:max-w-none'>{post.authorFirstName} {post.authorLastName}</span>
                        <span className='text-gray-300'>·</span>
                        <span className='text-gray-400 text-xs'>{converteTimeToString(post.createdAt)}</span>
                    </div>
                    <div className="flex gap-3 text-gray-400 text-sm">
                        <span className="flex gap-1 items-center hover:text-amber-600">
                            <BsCaretUp className="text-base" />
                            {post.upPoint}
                        </span>
                        <span className="flex gap-1 items-center hover:text-blue-500">
                            <FaRegEye className="text-base" />
                            {post.viewCount}
                        </span>
                        <span className="flex gap-1 items-center hover:text-green-500">
                            <GoComment className="text-base" />
                            {post.commentCount}
                        </span>
                    </div>
                </div>
            ) : (
                <div className='flex gap-x-2 items-center'>
                    <img
                        src={post.authorAvatar ? post.authorAvatar : '/user.webp'}
                        alt='avatar'
                        className='h-7 w-7 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0'
                    />
                    <span className='font-medium text-sm text-gray-700 truncate'>{post.authorFirstName} {post.authorLastName}</span>
                    <span className='text-gray-300'>·</span>
                    <span className='text-gray-400 text-xs'>{converteTimeToString(post.createdAt)}</span>
                </div>
            )}
        </div>
    </Link>
}

export default PostListCard;