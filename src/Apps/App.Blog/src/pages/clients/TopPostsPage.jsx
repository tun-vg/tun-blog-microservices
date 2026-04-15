import { useEffect, useState } from "react";
import { getTopPosts } from "../../api/post/post";
import { converterTimeToOnlyDate } from "../../utils/handleTimeShow";
import { Link } from "react-router-dom";
import { BsCaretUp } from "react-icons/bs";
import { GoComment } from "react-icons/go";
import { FaRegEye } from "react-icons/fa";
import DOMPurify from 'dompurify';
import { getShortContent } from "../../utils/content";

const TopPostsPage = () => {
    const [topPosts, setTopPosts] = useState([])

    const fetchDataTopPosts = async () => {
        const response = await getTopPosts(10);
        setTopPosts(response);
    }

    useEffect(() => {
        fetchDataTopPosts();
    }, [])

    return <>
        <div className="container-app md:px-[5%] 2xl:px-[25%] xl:px-[17%]">
            <div
                className="w-full text-center text-2xl font-semibold pb-5"
            >
                #Top 10 bài viết hay nhất
            </div>
            <hr />
            {topPosts.map((p) => (
                <div key={p.postId} className="py-5 flex flex-col gap-5">
                    <div>
                        <div
                            className="text-gray-500 text-sm flex gap-2 items-center"
                        >
                            <div>{p.categoryName}</div>
                            <div className='bg-gray-400 h-1 w-1 rounded-sm'></div>
                            <div>{converterTimeToOnlyDate(p.createdAt)}</div>
                        </div>
                        <Link
                            to={`/post/${p.postId}/${p.slug}`}
                            className="font-semibold text-2xl"
                        >
                            {p.title}
                        </Link>
                    </div>
                    <div>
                        <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getShortContent(p.content)) }} />
                    </div>
                    <Link
                        to={`/post/${p.postId}/${p.slug}`}
                        className="text-blue-400 flex gap-2 items-center"
                    >
                        <div>Đọc tiếp</div>
                        <div className='h-1 w-1 rounded-sm bg-blue-300'></div>
                        <div>{p.readingTime} phút đọc</div>
                    </Link>
                    <div
                        className="flex justify-between py-2 text-gray-400"
                    >
                        <div className="flex gap-4">
                            <div className="content-center flex gap-1 items-center">
                                <BsCaretUp
                                    className="text-2xl tcursor-pointer hover:scale-125"
                                    onClick={() => handleUpVote()}
                                />
                                <div className="text-center">{p.upPoint}</div>
                            </div>

                            <div className="flex gap-1 items-center">
                                <GoComment />
                                <div>{p.commentCount}</div>
                            </div>

                            <div className="flex gap-1 items-center">
                                <FaRegEye />
                                <div>{p.viewCount}</div>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    </>
}

export default TopPostsPage;