import { MdOutlineEmail, MdOutlineLocationOn, MdOutlinePhone } from "react-icons/md";
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialFacebook } from "react-icons/ti";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-white">
            <div className="container-app mx-auto px-4 py-10">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold">TUN BLOG</h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Nơi mọi người chia sẻ mọi câu chuyện với tất cả các chủ đề được quan tâm trong cuộc sống.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">Khám phá</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="hover:text-white transition-colors">Về chúng tôi</li>
                            <li className="hover:text-white transition-colors">Điều khoản dịch vụ</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">Liên hệ</h3>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center gap-2">
                                <MdOutlineEmail className="text-slate-400" />
                                <span>vuongtoantuan2001@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdOutlinePhone className="text-slate-400" />
                                <span>(+84) 931 502 001</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MdOutlineLocationOn className="text-slate-400" />
                                <span>Hà Nội, Việt Nam</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">Mạng xã hội</h3>
                        <div className="flex items-center gap-3 text-xl text-slate-300">
                            <Link to="https://www.facebook.com/tuanvuong01/" target="_blank" className="rounded-full border border-slate-600 p-2 hover:bg-slate-700 hover:text-white transition">
                                <TiSocialFacebook />
                            </Link>
                            <Link to="https://www.instagram.com/tun.03.11/" target="_blank" className="rounded-full border border-slate-600 p-2 hover:bg-slate-700 hover:text-white transition">
                                <SlSocialInstagram />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-700 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-slate-400">
                    <span>© 2026 TUN BLOG. Bảo lưu mọi quyền.</span>
                    <div className="flex flex-wrap gap-4">
                        <span className="hover:text-white transition-colors cursor-pointer">Chính sách bảo mật</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Điều khoản sử dụng</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;