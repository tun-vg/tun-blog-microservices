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

    const tagColors = [
        'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
        'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
        'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
        'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    ];

    return (
        <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                <h2 className='text-base font-bold text-gray-800'>Chủ đề</h2>
            </div>
            <div className='flex flex-wrap gap-2'>
                {dataTag.map((t, idx) => (
                    <button
                        key={t.tagId}
                        className={`border rounded-full py-1 px-3 text-sm font-medium transition-colors cursor-pointer ${tagColors[idx % tagColors.length]}`}
                    >
                        {t.tagName}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TopicsSection;