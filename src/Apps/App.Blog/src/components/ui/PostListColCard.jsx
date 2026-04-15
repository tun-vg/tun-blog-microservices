import { BsEye } from "react-icons/bs";
import { extractFirstImage } from "../../utils/content";
import { converteTimeToString } from "../../utils/handleTimeShow";

const PostListColCard = ({ post, showAuthor = true }) => {



    return <>
        <div className='w-fit flex flex-col gap-y-3 bg-gray-50 mb-8'>
            <img
                src={extractFirstImage(post.content)}
                alt='image'
                className='h-auto min-h-48 w-full rounded-lg object-cover'
            />
            <div className='flex justify-between items-center'>
                <p className='text-gray-400'>{post.readingTime} phút đọc</p>
                {/* <CiBookmark className='h-5 w-5 text-gray-400' /> */}
            </div>
            <div className="h-full w-full flex flex-col justify-between">
                <p className="w-auto">{post.title}</p>
                <div className='flex items-center justify-between'>
                    {showAuthor ? (
                        <div className="flex items-center justify-center gap-x-2">
                            <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-7 w-7 rounded-2xl' />
                            <div className='h-1 w-1 bg-gray-400 rounded-md'></div>
                            <div className='text-gray-400'>{converteTimeToString(post.createdAt)}</div>
                        </div>
                    ) : (
                        <div className='text-gray-400'>
                            {converteTimeToString(post.createdAt)}
                        </div>
                    )}
                    
                    <span className="grid grid-cols-2 place-items-center">
                        <BsEye />
                        {post.viewCount}
                    </span>
                </div>
            </div>
        </div>
    </>
}

export default PostListColCard;