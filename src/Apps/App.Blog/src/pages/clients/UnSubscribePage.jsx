import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import { UnSubscribe } from '../../api/notification/notification';

const UnSubscribePage = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';

    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleUnsubscribe = async () => {
        setStatus('loading');
        try {
            const response = await UnSubscribe(email);
            await new Promise((r) => setTimeout(r, 800)); // placeholder
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white border border-gray-200 p-8 text-center shadow-sm"
            >
                {status === 'success' ? (
                    <>
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <HiOutlineCheckCircle className="h-9 w-9 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Hủy đăng ký thành công</h1>
                        <p className="mt-3 text-gray-500">
                            Email <span className="font-medium text-gray-700">{email}</span> đã được
                            xóa khỏi danh sách nhận bản tin.
                        </p>
                        <Link
                            to="/"
                            className="mt-6 inline-block bg-gray-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                        >
                            Về trang chủ
                        </Link>
                    </>
                ) : status === 'error' ? (
                    <>
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <HiOutlineXCircle className="h-9 w-9 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Đã xảy ra lỗi</h1>
                        <p className="mt-3 text-gray-500">
                            Không thể hủy đăng ký. Vui lòng thử lại sau.
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-6 inline-block bg-gray-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                        >
                            Thử lại
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <HiOutlineMail className="h-9 w-9 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Hủy đăng ký nhận bản tin</h1>
                        <p className="mt-3 text-gray-500">
                            Bạn đang yêu cầu hủy nhận bản tin hàng tuần cho email:
                        </p>
                        <p className="mt-1 font-medium text-gray-700 break-all">{email || '—'}</p>
                        <p className="mt-3 text-sm text-gray-400">
                            Sau khi hủy, bạn sẽ không còn nhận được email tổng hợp bài viết hàng tuần nữa.
                        </p>

                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={handleUnsubscribe}
                                disabled={!email || status === 'loading'}
                                className="w-full bg-red-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Đang xử lý...' : 'XÁC NHẬN HỦY ĐĂNG KÝ'}
                            </button>
                            <Link
                                to="/"
                                className="w-full border border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 inline-block"
                            >
                                Quay lại trang chủ
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default UnSubscribePage;
