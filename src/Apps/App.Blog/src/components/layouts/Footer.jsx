import { MdOutlineEmail, MdOutlineLocationOn, MdOutlinePhone } from "react-icons/md";
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialFacebook } from "react-icons/ti";

const Footer = () => {
    return (
        <>
            <hr/>
            <div className="container-app w-full h-32 text-black pb-20">
                <div className="flex justify-between">
                    <div>
                        <div>Myblog</div>
                        <p className="text-gray-400">Nơi mọi người chia sẻ mọi câu chuyện với tất cả các chủ đề được quan tâm trong cuộc sống!</p>
                    </div>
                    <div>
                        <div>Title</div>
                        <ul className="text-gray-400">
                            <li>About</li>
                            <li>About Us</li>
                        </ul>
                    </div>
                    <div>
                        <div>Liên hệ hợp tác</div>
                        <ul className="text-gray-400 flex flex-col gap-y-2">
                            <li className="flex items-center gap-x-1"><MdOutlineEmail className="mt-[2px]"/>vuongtoantuan2001@gmail.com</li>
                            <li className="flex items-center gap-x-1"><MdOutlinePhone />(+84)931502001</li>
                            <li className="flex items-center gap-x-1"><MdOutlineLocationOn />Ha Noi, Viet Nam</li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <div>Media</div>
                        {/* <div className="border-white rounded-xl">
                            <input type="email" name="email" />
                            <button>Subcribe</button>
                        </div> */}
                        <div className="flex gap-x-3">
                            <TiSocialFacebook />
                            <SlSocialInstagram />
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="flex justify-between">
                    <div>© Hihihaha</div>
                    <div>Policy</div>
                </div>
            </div>
        </>
    )
}

export default Footer;