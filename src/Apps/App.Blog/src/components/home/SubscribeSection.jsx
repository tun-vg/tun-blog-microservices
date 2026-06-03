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
            <div className='w-full mt-5 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 shadow-md'>
                <div className="p-5">
                    <form
                        onSubmit={handleSubmit(subscription)}
                        className='flex flex-col gap-y-3'
                    >
                        <div className="text-2xl">✉️</div>
                        <h2 className='font-bold text-base text-white leading-snug'>
                            Đừng bỏ lỡ những bài viết hay nhất!
                        </h2>
                        <p className="text-amber-100 text-sm">
                            Mỗi tuần, chúng mình gửi tổng hợp bài viết đáng đọc nhất vào hộp thư của bạn.
                        </p>
                        <input
                            name="email"
                            type='email'
                            {...register('email', { required: "Vui lòng nhập email!" })}
                            required
                            placeholder='Email của bạn'
                            className='rounded-lg px-3 py-2 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/90 placeholder-gray-400'
                        />
                        <button
                            type='submit'
                            className='w-full bg-white text-amber-600 font-bold py-2 rounded-lg text-sm hover:bg-amber-50 transition-colors shadow-sm'
                        >
                            ĐĂNG KÝ NGAY
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default SubscribeSection;