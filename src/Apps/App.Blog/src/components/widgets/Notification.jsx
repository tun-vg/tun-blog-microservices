import { useEffect, useRef, useState } from "react"
import { GetNotificationsByUserId } from "../../api/notification/notification";
import useOutsideClick from "../common/OutSide";
import { converterTimeToDateTime, converteTimeToString } from "../../utils/handleTimeShow";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { IoMdClose } from "react-icons/io";
import { CiBellOn } from "react-icons/ci";
import { SlOptionsVertical } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import * as signalR from "@microsoft/signalr";

const Notification = () => {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    const userId = keycloak?.tokenParsed?.sub;
    const [openNotify, setOpenNotify] = useState(false);
    const [countUnreadNotify, setCountUnreadNotify] = useState(0);
    const [dataListNotify, setDataListNotify] = useState([]);
    const [isNotificationSub, setIsNotifycationSub] = useState(false);
    const [notificationId, setNotificationId] = useState(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 10;

    const notifyRef = useRef();
    const loaderRef = useRef();
    useOutsideClick(notifyRef, () => setOpenNotify(false));
    useOutsideClick(notifyRef, () => setIsNotifycationSub(false));

    const handleOpenNotify = () => {
        if (!openNotify) {
            if (initialized && keycloak.authenticated && userId) {
                setPageNumber(1);
                setHasMore(true);
                setDataListNotify([]);
                fetchNotifications(1, true);
                setOpenNotify(true);
                setCountUnreadNotify(0);
            }
        } else {
            setOpenNotify(false);
        }
    }

    const fetchNotifications = async (page = 1, isReset = false) => {
        if (userId && !isLoading) {
            try {
                setIsLoading(true);
                const response = await GetNotificationsByUserId(userId, page, pageSize);
                const newItems = response.items || [];

                if (isReset) {
                    setDataListNotify(newItems);
                } else {
                    setDataListNotify(prev => [...prev, ...newItems]);
                }

                setCountUnreadNotify(response.countUnreadNotify);
                setHasMore(newItems.length === pageSize);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const loadMoreNotifications = () => {
        if (hasMore && !isLoading) {
            const nextPage = pageNumber + 1;
            setPageNumber(nextPage);
            fetchNotifications(nextPage, false);
        }
    };

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchNotifications();
        }
    }, [initialized, keycloak.authenticated, userId]);

    useEffect(() => {
        if (!openNotify || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreNotifications();
                }
            },
            { threshold: 0.1 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [openNotify, hasMore, isLoading, pageNumber]);

    useEffect(() => {
        if (!initialized && !keycloak.authenticated && !userId) {
            return;
        }

        if (userId) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5074/notificationHub", {
                    accessTokenFactory: () => keycloak.token,
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            connection.start()
                .then(() => {
                    console.log("SignalR Connected with userId:", userId);

                    connection.on("ReceiveNotification", (notification) => {
                        setDataListNotify(prev => [notification, ...prev]);
                        setCountUnreadNotify(prev => prev + 1);
                    });
                })
                .catch(err => console.error("SignalR error:", err));

            return () => {
                if (connection) {
                    connection.stop();
                }
            };
        }
    }, [initialized, keycloak.authenticated, userId])

    const deleteAllNotifyHandler = () => {
        
    }

    if (!initialized) {
        return <CiBellOn className='w-6 h-6 opacity-20' />; 
    }

    return <>
        <div className='flex'>
            <div className='relative w-full h-12 flex justify-end items-center' ref={notifyRef}>
                <div onClick={() => { handleOpenNotify() }} className='h-12 flex items-center cursor-pointer'>
                    <CiBellOn className='w-6 h-6' />
                    {countUnreadNotify > 0 &&
                        <div className='absolute ml-[10px] mt-[-18px] bg-red-500 rounded-full w-6 h-6 text-white text-center'>{countUnreadNotify}</div>
                    }
                </div>
                {openNotify && (
                    <div className='bg-slate-100 absolute right-1 h-fit min-w-[378px] w-3/12 top-full border-solid border-[1px] rounded-xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25)]'>
                        {/* <div className='absolute z-50 h-auto max-h-[calc(100vh-115px)] w-[378px] rounded-xl bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25)]'> */}
                        <div className='flex justify-between items-center p-2'>
                            <div>Thông báo</div>
                            <IoMdClose 
                                onClick={() => setOpenNotify(false)}
                            />
                        </div>
                        <div className='flex items-center justify-end gap-x-8 border-b px-4 py-4 text-sm font-normal'>
                            <div className='cursor-pointer'>Đánh dấu đã đọc</div>
                            <div className='cursor-pointer' onClick={() => {
                                deleteAllNotifyHandler();
                            }}>Gỡ tất cả</div>
                        </div>
                        <hr />
                        {!isLoading && (dataListNotify === null || dataListNotify.length === 0) && (
                            <div className='p-3'>Không có dữ liệu</div>
                        )}

                        <div className='overflow-y-auto max-h-[70vh]'>
                            {dataListNotify?.map(item => {
                                return <div 
                                            key={item.notificationId} 
                                            className='relative hover:bg-slate-200'
                                        >
                                    <div className={`flex text-left justify-between items-center pl-2 pt-2 pb-2 ${item.status === true && 'bg-white hover:bg-slate-200'}`}>
                                        <div 
                                            className='w-11/12'
                                            onClick={() => {
                                                setOpenNotify(false);
                                                navigate(`${item.link}`);
                                            }}
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: item.contentVi }} />
                                            <div className='w-fit'>
                                                <p data-tooltip-id={`my-tooltip-${item.notificationId}`}>{converteTimeToString(item.createdAt)}</p>
                                                <ReactTooltip
                                                    id={`my-tooltip-${item.notificationId}`}
                                                    place="right"
                                                    content={converterTimeToDateTime(item.createdAt)}
                                                />
                                            </div>
                                        </div>
                                        <div className='pr-2'>
                                            <SlOptionsVertical className='cursor-pointer p-2 h-12 w-9' onClick={() => {
                                                if (!isNotificationSub) {
                                                    setIsNotifycationSub(true);
                                                    setNotificationId(item.notificationId);
                                                } else {
                                                    setIsNotifycationSub(false);
                                                    setNotificationId(null);
                                                }
                                            }} />
                                        </div>
                                        {isNotificationSub && notificationId === item.notificationId && <div className='absolute right-4 bg-white select-none'>
                                            <ul className="absolute -top-8 right-[20px] whitespace-nowrap rounded-md bg-white text-xs font-normal shadow-[0px_6px_58px_rgba(121,145,173,0.2)]">
                                                {/* Mark as read or unread */}
                                                <li
                                                    className="cursor-pointer p-2 hover:text-primary-100"
                                                >
                                                    Đánh dấu là đã đọc
                                                </li>

                                                {/* Remote this notification */}
                                                <li
                                                    className="cursor-pointer p-2 hover:text-red-500"
                                                    onClick={() => {
                                                        console.log("Call api delete notify by id: " + item.notificationId);
                                                        deleteNotifyHandler(item);
                                                    }}
                                                >
                                                    Gỡ thông báo
                                                </li>
                                            </ul>
                                        </div>
                                        }
                                    </div>
                                    <hr />
                                </div>
                            })}
                            {hasMore && (
                                <div ref={loaderRef} className='p-3 text-center text-sm text-gray-500'>
                                    {isLoading ? 'Đang tải...' : 'Cuộn xuống để tải thêm'}
                                </div>
                            )}
                            {!hasMore && dataListNotify.length > 0 && (
                                <div className='p-3 text-center text-sm text-gray-500'>
                                    Đã tải hết thông báo
                                </div>
                            )}
                        </div>
                    </div>
                )}


            </div>
        </div>
    </>
}

export default Notification;