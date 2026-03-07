import { a } from "framer-motion/client";
import { useForm } from "react-hook-form";
import { Subscribe } from "../../api/notification/notification";
import { toast, ToastContainer } from "react-toastify";

const SubscribeSection = () => {

    const { handleSubmit, register, reset } = useForm({email: null});

    const subscription = async (data) => {
        try {
            const response = await Subscribe(data.email);
            toast.success("Đăng ký theo dõi thành công!");
            reset({email: null});
        } catch (err) {
            if (err.status === 409) {
                toast.error("Email đã được sử dụng!");
            } else {
                toast.error("Đã xảy ra lỗi vui lòng thử lại sau!");
            }
        }
    }

    return (
        <>
            {/* Email Sub */}
            <div className='border-gray-200 border-[1px] w-full h-fit mt-7 p-5'>
                <form
                    onSubmit={handleSubmit(subscription)}
                    className='flex flex-col gap-y-3'
                >
                    <h1 className='font-bold text-xl'>CÁC BÀI VIẾT NỔI BẬT BẠN KHÔNG NÊN BỎ LỠ!</h1>
                    <p>Chủ nhật hàng tuần, chúng mình sẽ gửi bạn email tổng hợp những bài viết đáng đọc nhất trong tuần.</p>
                    <label for="email">Chúng mình có thể gửi thư cho bạn qua:</label>
                    <input type='email' {...register('email', { required: "Vui lòng nhập email!" })} required placeholder='Email của bạn' className='p-1 border-gray-300 border-[1px] p-2' />
                    <input type='submit' value="ĐĂNG KÝ" className='w-full bg-blue-500 text-white font-bold p-2' />
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default SubscribeSection;