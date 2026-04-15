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
        <>
            <div className="py-5">
                <div className='flex gap-x-8'>
                    <div>
                        <div className={`${!classification ? ' font-bold' : ''} pl-2 pr-2 hover:cursor-pointer`} onClick={() => { changeClassification(false) }}>Dành cho bạn</div>
                        <div className={`${!classification ? 'bg-blue-500' : ''} h-1 w-full`}></div>
                    </div>
                    <div>
                        <div className={`${classification ? ' font-bold' : ''} pl-2 pr-2 hover:cursor-pointer`} onClick={() => { changeClassification(true) }}>Đánh giá cao nhất</div>
                        <div className={`${classification ? 'bg-blue-500' : ''} h-1 w-full`}></div>
                    </div>
                </div>
                <hr className='w-[65%]' />
                <div className="grid gap-4">
                    {data.map((p) => {
                        return <PostListCard key={p.postId} post={p} showAction={true}/>
                    })}
                </div>
                {/* Pagination */}
                <div>
                    <div>
                        <Pagination page={page} count={data.length} onPageChange={changedPage} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecommendedPosts;