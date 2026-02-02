import { useEffect, useState } from "react";
import { addTag, deleteTag, getTags, updateTag } from "../../../api/tag/tag";
import { dataFilterUserExample } from '../../../configs/filter-configs/valueFilterTable';
import TableSearch from "../../../components/data-displays/Table/TableHeader/TableSearch";
import Filter from "../../../components/data-displays/Filter";
import TableAdditional from "../../../components/data-displays/TableAdditional";
import { CiCirclePlus } from "react-icons/ci";
import Popup from "../../../components/ui/Popup";
import TextField from "../../../components/form/TextField";
import { useForm } from "react-hook-form";
import { getTagPageColumns } from "../../../configs/table-configs/columns/tagPageColumns";
import { ToastContainer, toast } from "react-toastify";
import { getCategories } from "../../../api/category/category";
import Select from 'react-select';

const TagManagementPage = () => {
    const [dataTags, setDataTags] = useState([]);
    const [isEditingTag, setIsEditingTag] = useState(null);
    const [dataCategories, setDataCategories] = useState([]);
    const [selectedValueCate, setSelectedValueCate] = useState(null);

    const getDataTags = async () => {
        const result = await getTags();
        setDataTags(result?.items ?? []);
    }

    const getDataCategories = async () => {
        const result = await getCategories();
        let arr = [];
        result?.items.forEach(e => {
            // arr = [...arr, {value: e.categoryId, label: e.categoryName}];
            arr.push({ value: e.categoryId, label: e.name });
        });
        setDataCategories(arr);
    }

    const handleOptionsSelect = () => {

    }

    useEffect(() => {
        getDataTags();
    }, [])


    const [tableAdditionalState, setTableAdditionalState] = useState({
        valueSearch: '',
        sort: { column: null, direction: 'asc' },
        page: 1,
        rowsPerPage: 10,
    });
    const [filterValues, setFilterValues] = useState({});

    const handleFilterChange = (newFilters) => {
        setFilterValues(newFilters);
    };

    const showFilterContent = <>💻 Filter</>;

    console.log("filterValues", filterValues);

    const handleEdit = (tag) => {
        console.log(`Edit item with ID ${tag.tagId}`);
        // Add your edit logic here
        setIsEditingTag(tag);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await deleteTag(id);

        if (result.isSuccess) {
            setDataTags(newDataTags => newDataTags.filter(dataTags => dataTags.tagId !== id));
        }
    };

    // const columns = getExamplePageColumns(handleEdit, handleDelete);
    const columns = getTagPageColumns(handleEdit, handleDelete);

    const handleRowClick = (item) => {
        console.log(`Clicked row with ID ${item.id}`);
    };

    const [open, setOpen] = useState(false);

    const openAddForm = () => {
        setOpen(true);
        setIsEditingTag(null);
        // reset({ tagId: null, name: "", slug: "" });
    };

    const { control, handleSubmit, reset, register } = useForm({
        defaultValues: { tagId: null, name: "", slug: "" },
    });

    const handleSelectedChage = (selectedOption) => {
        setSelectedValueCate(selectedOption);
        console.log('Selected value:', selectedOption ? selectedOption.value : null);
    }

    const onSubmit = async (data) => {
        data.categoryId = selectedValueCate.value;
        if (isEditingTag) {
            const resultUpdated = await updateTag(data);
            if (resultUpdated.isSuccess) {
                await getDataTags();
                setOpen(false);
                setSelectedValueCate(null);
                toast("Updated Tag Successfully!");
            }
        } else {
            const resultCreated = await addTag(data);
            if (resultCreated.isSuccess) {
                resultCreated.value.categoryName = selectedValueCate.label;
                const updateDataTag = [resultCreated.value, ...dataTags];
                setDataTags(updateDataTag)
                setOpen(false);
                setSelectedValueCate(null);
                toast("Add tag successfully!");
            }
        }
    }

    useEffect(() => {
        if (open) {
            reset(isEditingTag);
        } else {
            reset({ tagId: null, name: "", slug: "" });
        }
    }, [open, reset])

    useEffect(() => {
        getDataCategories();
    }, [open])

    return (
        <>
            <div>
                <div className="flex justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Danh sách thẻ</h1>
                        <div className="text-gray-500">Quản lý danh sách thẻ của các bài viết</div>
                    </div>
                    <button onClick={() => openAddForm()} className="bg-blue-500 rounded-lg px-4 text-white flex gap-2 justify-center items-center font-semibold my-1">
                        <CiCirclePlus className="text-2xl" />
                        Thêm thẻ
                    </button>
                </div>

                <div className="flex items-center justify-center">
                    <Popup isOpen={open} onClose={() => setOpen(false)} title={isEditingTag ? "Update Tag" : "Add Tag"}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input type="hidden" {...register("tagId")} />

                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <Select
                                options={dataCategories}
                                onChange={handleSelectedChage}
                                value={selectedValueCate}
                                className="mb-4"
                            />

                            <TextField
                                name="name"
                                label="Tag Name"
                                control={control}
                                placeholder="Name"
                            />

                            <TextField
                                name="slug"
                                label="Slug"
                                placeholder="Slug"
                                control={control}
                            />
                            <button
                                type="submit"
                                className="mt-4 px-3 py-1 bg-green-500 text-white rounded-lg"
                            >
                                {isEditingTag ? "Update" : "Add"}
                            </button>
                        </form>

                    </Popup>
                </div>
                {/* <div className="my-4 flex justify-between gap-4">
                    <div className="mt-4 w-full">
                        <h2 className="my-2 text-xl font-semibold">Search :</h2>
                        <pre className="rounded bg-gray-100 p-4">
                            {JSON.stringify(tableAdditionalState, null, 2)}
                        </pre>
                    </div>
                    <div className="mt-4 w-full">
                        <h2 className="my-2 text-xl font-semibold">Filter :</h2>
                        <pre className="rounded bg-gray-100 p-4">
                            {JSON.stringify(filterValues, null, 2)}
                        </pre>
                    </div>
                </div> */}

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
                    data={dataTags}
                    onRowClick={handleRowClick}
                />
            </div>
            <ToastContainer />
        </>
    )
}

export default TagManagementPage;