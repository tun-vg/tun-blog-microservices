import { useEffect, useRef, useState } from "react"
import { GetNotificationsByUserId } from "../../api/notification/notification";
import useOutsideClick from "../common/OutSide";
import { converterTimeToDateTime, converteTimeToString } from "../../utils/handleTimeShow";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { IoMdClose } from "react-icons/io";
import { CiBellOn } from "react-icons/ci";
import { BsBell, BsBellFill } from "react-icons/bs";
import { SlOptionsVertical } from "react-icons/sl";
import { GoComment, GoHeart } from "react-icons/go";
import { FiUserPlus } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import * as signalR from "@microsoft/signalr";

// Map notification type → icon + color
const NotifIcon = ({ type }) => {
    const map = {
        comment:  { icon: <GoComment />,   bg: "bg-blue-100",   text: "text-blue-600"   },
        like:     { icon: <GoHeart />,     bg: "bg-rose-100",   text: "text-rose-500"   },
        follow:   { icon: <FiUserPlus />,  bg: "bg-green-100",  text: "text-green-600"  },
    };
    const cfg = map[type?.toLowerCase()] ?? { icon: <BsBell />, bg: "bg-amber-100", text: "text-amber-600" };
    return (
        <span className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text} text-sm`}>
            {cfg.icon}
        </span>
    );
};

const Notification = () => {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();

    const userId = keycloak?.tokenParsed?.sub;
    const [openNotify, setOpenNotify]             = useState(false);
    const [countUnread, setCountUnread]           = useState(0);
    const [dataList, setDataList]                 = useState([]);
    const [activeMenu, setActiveMenu]             = useState(null); // notificationId
    const [pageNumber, setPageNumber]             = useState(1);
    const [hasMore, setHasMore]                   = useState(true);
    const [isLoading, setIsLoading]               = useState(false);
    const pageSize = 10;

    const notifyRef = useRef();
    const loaderRef = useRef();
    useOutsideClick(notifyRef, () => { setOpenNotify(false); setActiveMenu(null); });

    const fetchNotifications = async (page = 1, isReset = false) => {
        if (!userId || isLoading) return;
        try {
            setIsLoading(true);
            const response = await GetNotificationsByUserId(userId, page, pageSize);
            const items = response.items || [];
            setDataList(prev => isReset ? items : [...prev, ...items]);
            setCountUnread(response.countUnreadNotify ?? 0);
            setHasMore(items.length === pageSize);
        } catch (err) {
            console.error("Notification API error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenNotify = () => {
        if (!openNotify && initialized && keycloak.authenticated && userId) {
            setPageNumber(1);
            setHasMore(true);
            setDataList([]);
            fetchNotifications(1, true);
            setCountUnread(0);
        }
        setOpenNotify(v => !v);
        setActiveMenu(null);
    };

    const loadMore = () => {
        if (hasMore && !isLoading) {
            const next = pageNumber + 1;
            setPageNumber(next);
            fetchNotifications(next, false);
        }
    };

    // Initial fetch (for unread badge)
    useEffect(() => {
        if (initialized && keycloak.authenticated) fetchNotifications();
    }, [initialized, keycloak.authenticated, userId]);

    // Infinite scroll observer
    useEffect(() => {
        if (!openNotify || !hasMore) return;
        const observer = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) loadMore(); },
            { threshold: 0.1 }
        );
        const el = loaderRef.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [openNotify, hasMore, isLoading, pageNumber]);

    // SignalR real-time
    useEffect(() => {
        if (!initialized || !keycloak.authenticated || !userId) return;
        const conn = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5074/notificationHub", {
                accessTokenFactory: () => keycloak.token,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        conn.start()
            .then(() => {
                conn.on("ReceiveNotification", (n) => {
                    setDataList(prev => [n, ...prev]);
                    setCountUnread(prev => prev + 1);
                });
            })
            .catch(err => console.error("SignalR:", err));

        return () => conn.stop();
    }, [initialized, keycloak.authenticated, userId]);

    if (!initialized) return <CiBellOn className="w-6 h-6 opacity-30" />;

    return (
        <div className="relative" ref={notifyRef}>
            {/* ── Bell button ── */}
            <button
                onClick={handleOpenNotify}
                className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-colors ${openNotify ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100 text-gray-600'}`}
            >
                {openNotify
                    ? <BsBellFill className="w-5 h-5" />
                    : <BsBell className="w-5 h-5" />
                }
                {countUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none ring-2 ring-white">
                        {countUnread > 99 ? "99+" : countUnread}
                    </span>
                )}
            </button>

            {/* ── Dropdown panel ── */}
            {openNotify && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[400px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden z-50">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Thông báo</h3>
                            {countUnread > 0 && (
                                <p className="text-xs text-amber-600 font-medium mt-0.5">{countUnread} chưa đọc</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="text-xs text-gray-500 hover:text-amber-600 font-medium px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors">
                                Đánh dấu tất cả
                            </button>
                            <button
                                onClick={() => setOpenNotify(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <IoMdClose className="text-base" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-[70vh]">

                        {/* Empty state */}
                        {!isLoading && dataList.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                                <BsBell className="text-4xl mb-3 opacity-30" />
                                <p className="text-sm font-medium">Chưa có thông báo nào</p>
                                <p className="text-xs mt-1">Khi có hoạt động mới, bạn sẽ thấy ở đây.</p>
                            </div>
                        )}

                        {/* Items */}
                        {dataList.map((item) => (
                            <div key={item.notificationId} className="relative group">
                                <div
                                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${item.status ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/60 hover:bg-blue-50'}`}
                                    onClick={() => {
                                        setOpenNotify(false);
                                        navigate(item.link);
                                    }}
                                >
                                    {/* Type icon */}
                                    <NotifIcon type={item.type} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="text-sm text-gray-800 leading-snug [&_b]:font-semibold [&_b]:text-gray-900"
                                            dangerouslySetInnerHTML={{ __html: item.contentVi }}
                                        />
                                        <span
                                            data-tooltip-id={`notif-${item.notificationId}`}
                                            className="text-xs text-amber-600 font-medium mt-1 inline-block"
                                        >
                                            {converteTimeToString(item.createdAt)}
                                        </span>
                                        <ReactTooltip
                                            id={`notif-${item.notificationId}`}
                                            place="right"
                                            content={converterTimeToDateTime(item.createdAt)}
                                            className="z-50"
                                        />
                                    </div>

                                    {/* Unread dot */}
                                    {!item.status && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                    )}

                                    {/* Options button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === item.notificationId ? null : item.notificationId);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all flex-shrink-0"
                                    >
                                        <SlOptionsVertical className="text-xs" />
                                    </button>
                                </div>

                                {/* Context menu */}
                                {activeMenu === item.notificationId && (
                                    <div className="absolute right-10 top-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
                                        <button
                                            className="w-full text-left text-sm px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                                        >
                                            Đánh dấu là đã đọc
                                        </button>
                                        <button
                                            className="w-full text-left text-sm px-4 py-2 hover:bg-red-50 text-red-500 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                                        >
                                            Gỡ thông báo
                                        </button>
                                    </div>
                                )}

                                <div className="h-px bg-gray-100 mx-4" />
                            </div>
                        ))}

                        {/* Infinite scroll loader */}
                        {hasMore && (
                            <div ref={loaderRef} className="flex items-center justify-center py-4 text-gray-400">
                                {isLoading
                                    ? <AiOutlineLoading3Quarters className="animate-spin text-amber-500 text-lg" />
                                    : <span className="text-xs">Cuộn để tải thêm</span>
                                }
                            </div>
                        )}

                        {!hasMore && dataList.length > 0 && (
                            <div className="py-4 text-center text-xs text-gray-400">
                                Đã xem hết thông báo
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notification;
