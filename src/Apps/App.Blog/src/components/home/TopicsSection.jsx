import { useEffect, useState } from "react";
import { getTags } from "../../api/tag/tag";

const TopicsSection = () => {
    const [dataTag, setDataTag] = useState([]);
    const getDataTags = async () => {
        const result = await getTags();
        setDataTag(result.items);
    }

    useEffect(() => {
        getDataTags();
    }, [])

    return (
        <div className="py-5">
            <h1 className='text-xl font-semibold'>Chủ đề</h1>
            <div className='flex flex-wrap'>
                {dataTag.map((t) => {
                    return <div key={t.tagId} className='border-gray-300 border-[1px] rounded-2xl py-1 px-3 m-1 hover:cursor-pointer'>
                        <p>{t.name}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

export default TopicsSection;