import { CgDetailsMore } from "react-icons/cg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useState } from "react";
import { label } from "framer-motion/client";

export const getTagPageColumns = (handleEdit, handleDelete) => {
    const [ isOpenAction, setIsOpenAction ] = useState(false);
    const [ openActionId, setOpenActionId ] = useState('');

    return [
        { key: 'categoryName', label: 'Category Name' },
        { key: 'name', lable: 'Name' },
        { key: 'slug', label: 'Slug' },
        {
            key: 'actions',
            hiddenSort: true,
            hiddenRowClick: true,
            render: (item) => (
                <div>
                    <div>
                        <button onClick={() => {
                            if (!isOpenAction && openActionId == '') {
                                setIsOpenAction(true);
                                setOpenActionId(item.tagId);
                            } else if (isOpenAction && openActionId != item.tagId) {
                                setOpenActionId(item.tagId);
                            }
                            else {
                                setIsOpenAction(false);
                                setOpenActionId('');
                            }
                        }
                        }>
                            <IoReorderThreeOutline />
                        </button>
                        {isOpenAction && openActionId == item.tagId && (
                            <div className='absolute border-[1px] border-gray-400'>
                                <ul className="absolute whitespace-nowrap rounded-md bg-white text-xs font-normal shadow-[0px_6px_58px_rgba(121,145,173,0.2)]">
                                    <li className="cursor-pointer p-2 hover:text-blue-500 hover:bg-gray-300"
                                        onClick={() => handleEdit(item)}    
                                    >
                                        Edit
                                    </li>
                                    <li className="cursor-pointer p-2 hover:text-red-500 hover:bg-gray-300"
                                        onClick={() => handleDelete(item.tagId)}
                                    >
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div >
                </div>
            ),
        },
    ];
};