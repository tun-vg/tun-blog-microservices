import { Link, useNavigate } from "react-router-dom";
import { extractFirstImage, getPreviewContent } from "../../utils/content";
import { converteTimeToString } from "../../utils/handleTimeShow";
import { BsCaretUp } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa6";
import { GoComment } from "react-icons/go";

const PostListCard = ({ post, showAction = true }) => {
    const navigate = useNavigate();

    return <Link
        className='flex gap-x-4 mt-2 mb-6 bg-gray-50'
        to={`/post/${post.postId}/${post.slug}`}
    >
        <img src={extractFirstImage(post.content)} alt="" className="rounded-md max-h-[174px] max-w-[232px] object-cover" />

        <div className='flex flex-col gap-y-1 w-full justify-between'>
            <div className=' flex justify-between items-center'>
                <div className='flex gap-x-2 items-center'>
                    <p className='font-light text-base'>{post.categoryName}</p>
                    <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                    <p className='text-gray-400'>{post.readingTime} phút đọc</p>
                </div>
                {/* <CiBookmark
                    className='text-gray-400 w-6 h-6'
                // onClick={() => handlerBookmarkPost()}    
                /> */}
            </div>
            <div className='font-semibold text-xl'>{post.title}</div>
            <p className="text-gray-600 text-sm">
                {getPreviewContent(post.content, 100)}
            </p>
            
            {showAction ? (
                <div className="flex justify-between">
                    <div className='flex gap-x-2 items-center'>
                        <img src={`${post.authorAvatar}`} alt='avatar' className='h-7 w-7 rounded-2xl object-cover' />
                        <h3 className='font-semibold text-sm'>{post.authorFirstName} {post.authorLastName}</h3>
                        <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                        <div className='text-gray-400'>{converteTimeToString(post.createdAt)}</div>
                    </div>
                    <div className="flex gap-6">
                        <span className="flex gap-1 items-center">
                            <BsCaretUp className="text-2xl" />
                            {post.upPoint}
                        </span>
                        <span className="flex gap-1 items-center">
                            <FaRegEye className="text-xl pt-[1px]" />
                            {post.viewCount}
                        </span>
                        <span className="flex gap-1 items-center">
                            <GoComment className="text-xl pt-[1px]" />
                            10
                        </span>
                    </div>
                </div>
            ) : (
                <div className='flex gap-x-2 items-center'>
                    <img src={`${post.authorAvatar}`} alt='avatar' className='h-7 w-7 rounded-2xl object-cover' />
                    <h3 className='font-semibold text-sm'>{post.authorFirstName} {post.authorLastName}</h3>
                    <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                    <div className='text-gray-400'>{converteTimeToString(post.createdAt)}</div>
                </div>
            )}

        </div>
    </Link>
}

export default PostListCard;