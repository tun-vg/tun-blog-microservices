import { useEffect, useState } from "react";
import Filter from "../../../components/data-displays/Filter";
import TableSearch from "../../../components/data-displays/Table/TableHeader/TableSearch";
import { dataFilterUserExample } from "../../../configs/filter-configs/valueFilterTable";
import TableAdditional from "../../../components/data-displays/TableAdditional";
import { getPostManagementPageColumns } from "../../../configs/table-configs/columns/postManagementPageColumns";
import { getPosts } from "../../../api/post/post";

const PostManagementPage = () => {

    // filter var
    const showFilterContent = <>💻 Filter</>;

    const [filterValues, setFilterValues] = useState({});

    const handleFilterChange = (newFilters) => {
        setFilterValues(newFilters);
    };
    // end filter var

    // table var
    const [tableAdditionalState, setTableAdditionalState] = useState({
        valueSearch: '',
        sort: { column: null, direction: 'asc' },
        page: 1,
        rowsPerPage: 10,
    });

    const handleEdit = (data) => {
        console.log(data);
    }

    const handleDelete = async (id) => {
        console.log(id);
    }

    const handleRowClick = (id) => {
        console.log(id);
    }

    const columns = getPostManagementPageColumns(handleEdit, handleDelete);

    const paging = {
        page: 1,
        pageSize: 10,
        search: '',
        sortBy: '',
        isDescending: false
    }
    // end table var

    const [dataPosts, setDataPosts] = useState();

    const getDataPosts = async () => {
        const result = await getPosts(paging);
        setDataPosts(result.items);
    }

    useEffect(() => {
        getDataPosts();
    }, [])

    return (
        <>
            <div>
                <div>
                    <h2 className="text-2xl font-bold">Trang quản lý bài viết</h2>
                    <p className="text-gray-500">Quản lý danh sách bài viết của hệ thống</p>
                </div>

                <div className="bg-white p-2">
                    <div className="flex h-[60px] items-center justify-between">
                        <div className="w-[80%]">
                            <TableSearch
                                onSearchChange={(value) => console.log(value)}
                                classNames={'w-full'}
                            />
                        </div>
                        <div className="mr-4 filter">
                            <Filter
                                dataFilter={dataFilterUserExample}
                                showFilterContent={showFilterContent}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>

                <TableAdditional
                    tableState={tableAdditionalState}
                    setTableState={setTableAdditionalState}
                    columns={columns}
                    data={dataPosts}
                    onRowClick={handleRowClick}
                />
            </div>
        </>
    )
}

export default PostManagementPage;