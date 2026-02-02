const SubscribeSection = () => {

    return (
        <>
            {/* Email Sub */}
            <div className='border-gray-200 border-[1px] w-full h-fit mt-7 p-5'>
                <form className='flex flex-col gap-y-3'>
                    <h1 className='font-bold text-xl'>CÁC BÀI VIẾT NỔI BẬT BẠN KHÔNG NÊN BỎ LỠ!</h1>
                    <p>Chủ nhật hàng tuần, chúng mình sẽ gửi bạn email tổng hợp những bài viết đánh đọc nhất trong tuần.</p>
                    <label for="email">Chúng mình có thể gửi thư cho bạn qua:</label>
                    <input type='email' name='email' placeholder='Email của bạn' required className='p-1 border-gray-300 border-[1px] p-2' />
                    <input type='submit' value="ĐĂNG KÝ" className='w-full bg-blue-500 text-white font-bold p-2' />
                </form>
            </div>
        </>
    )
}

export default SubscribeSection;