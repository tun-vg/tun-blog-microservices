import { useForm } from "react-hook-form";
import TextField from "../../components/form/TextField";
import { useKeycloak } from "@react-keycloak/web";
import { registerUser } from "../../api/user/user";
import { toast, ToastContainer } from "react-toastify";

const CreateUserPage = () => {
    const { keycloak } = useKeycloak();
    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
            enabled: true,
        }
    });

    const handleRegister = async (data) => {
        try {
            const payload = {
                username: data.username.trim(),
                email: data.email.trim(),
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                password: data.password,
            };

            await registerUser(payload);
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            reset();
        } catch (error) {
            const message = error?.response?.data?.error_description || error?.response?.data?.message || error?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            toast.error(message);
        }
    }

    const password = watch('password');

    return (
        <div className="bg-[#f5ede2] min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                <div className="font-bold text-2xl grid justify-center pb-5">Đăng ký tài khoản</div>
                <TextField
                    label="User Name"
                    name="username"
                    placeholder="Nhập tên đăng nhập"
                    control={control}
                    rules={{
                        required: 'Tên đăng nhập là bắt buộc',
                        minLength: { value: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                    }}
                />
                <TextField
                    label="Email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    control={control}
                    rules={{
                        required: 'Email là bắt buộc',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' }
                    }}
                />
                <TextField
                    label="First Name"
                    name="firstName"
                    placeholder="Nhập tên"
                    control={control}
                    rules={{ required: 'Tên là bắt buộc' }}
                />

                <TextField
                    label="Last Name"
                    name="lastName"
                    placeholder="Nhập họ"
                    control={control}
                    rules={{ required: 'Họ là bắt buộc' }}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    control={control}
                    placeholder="Nhập mật khẩu"
                    rules={{
                        required: 'Mật khẩu là bắt buộc',
                        minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    }}
                />
                <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    control={control}
                    placeholder="Xác nhận mật khẩu"
                    rules={{
                        required: 'Vui lòng xác nhận mật khẩu',
                        validate: (value) => value === password || 'Mật khẩu xác nhận không khớp'
                    }}
                />
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
                    </button>
                </div>
                <div onClick={() => keycloak.login()} className="text-blue-500 hover:underline mt-4 block text-center">
                    Đã có tài khoản? Đăng nhập
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default CreateUserPage;