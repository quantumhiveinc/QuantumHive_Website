// src/components/GallerySlider.tsx
"use client";

import React from 'react';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import required modules
import { Navigation, Pagination, A11y } from 'swiper/modules';

interface GalleryImage {
    id?: number; // Optional ID if needed later
    url: string;
    altText?: string | null;
}

interface GallerySliderProps {
    images: GalleryImage[];
}

const GallerySlider: React.FC<GallerySliderProps> = ({ images }) => {
    if (!images || images.length === 0) {
        return null; // Don't render anything if no images
    }

    return (
        <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={30} // Space between slides
            slidesPerView={1} // Show one slide at a time by default
            navigation // Enable navigation arrows
            pagination={{ clickable: true }} // Enable clickable pagination dots
            loop={images.length > 1} // Enable loop only if more than one image
            className="w-full rounded-lg overflow-hidden" // Add some basic styling
            // Responsive breakpoints (optional)
            // breakpoints={{
            //     // when window width is >= 640px
            //     640: {
            //         slidesPerView: 2,
            //         spaceBetween: 20
            //     },
            //     // when window width is >= 768px
            //     768: {
            //         slidesPerView: 3,
            //         spaceBetween: 30
            //     }
            // }}
        >
            {images.map((image, index) => (
                <SwiperSlide key={image.id || index}>
                    <div className="aspect-video relative w-full"> {/* Maintain aspect ratio */}
                        <Image
                            src={image.url}
                            alt={image.altText || `Gallery image ${index + 1}`}
                            layout="fill"
                            objectFit="contain" // Use contain to show the whole image
                            className="rounded-md"
                        />
                    </div>
                     {/* Optional: Add caption/alt text display below image */}
                     {/* {image.altText && <p className="text-center text-sm mt-2 text-muted-foreground">{image.altText}</p>} */}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default GallerySlider;