import { CiBookmark } from "react-icons/ci"
import Pagination from "../data-displays/Pagination/Pagination"
import { useEffect, useState } from "react"
import { getRecommendedPosts } from "../../api/post/post";
import { converteTimeToString } from "../../utils/handleTimeShow";
import PostListCard from "../ui/PostListCard";

const RecommendedPosts = () => {
    const [data, setData] = useState([]);
    const getData = async () => {
        const result = await getRecommendedPosts();
        setData(result.items);
    }

    const [classification, setClassification] = useState(false);

    const changeClassification = (val) => {
        setClassification(val);
    }

    const [page, setPage] = useState(1);

    const changedPage = (page) => {
        console.log(page);
        setPage(page);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="py-6 border-t border-gray-100">
            <div className='flex gap-x-1 mb-1 border-b border-gray-200'>
                <button
                    className={`pb-2 px-4 text-sm font-semibold transition-colors relative ${!classification ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => changeClassification(false)}
                >
                    Dành cho bạn
                    {!classification && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>}
                </button>
                <button
                    className={`pb-2 px-4 text-sm font-semibold transition-colors relative ${classification ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => changeClassification(true)}
                >
                    Đánh giá cao nhất
                    {classification && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>}
                </button>
            </div>
            <div className="grid gap-2 mt-2">
                {data.map((p) => (
                    <PostListCard key={p.postId} post={p} showAction={true} />
                ))}
            </div>
            <div className="mt-4">
                <Pagination page={page} count={data.length} onPageChange={changedPage} />
            </div>
        </div>
    )
}

export default RecommendedPosts;