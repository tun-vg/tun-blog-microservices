import React, { useState, useEffect } from 'react';

const ImageZoom = ({ src, alt = "image", className = "", width, height }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // Xử lý sự kiện nhấn phím ESC để đóng và khoá scroll body
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Khoá cuộn trang
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto'; // Mở lại cuộn trang
        };
    }, [isOpen]);

    return (
        <>
            {/* Ảnh Thumbnail (Ảnh nhỏ để bấm vào) */}
            <img
                src={src}
                alt={alt}
                onClick={openModal}
                className={className}
                width={width}
                height={height}
                style={{ cursor: 'zoom-in', objectFit: 'cover' }}
            />

            {/* Màn hình Modal hiển thị ảnh to */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 cursor-zoom-out"
                    onClick={closeModal}
                >
                    <button
                        className="absolute top-5 right-5 text-white text-5xl hover:text-gray-300"
                        onClick={closeModal}
                    >
                        &times;
                    </button>

                    <img
                        src={src}
                        alt={alt}
                        className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};


export default ImageZoom;