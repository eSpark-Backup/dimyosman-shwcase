import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';

const DynamicPaginationSwiper = ({ onClick, slides }) => {
    return (
        <Swiper
            pagination={{
                dynamicBullets: true,
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
            style={{ width: "100%", cursor: onClick ? "pointer" : "default" }}
        >
            {slides.map((slideImage, index) => (
                <SwiperSlide key={index}>
                    <div className="slide-content" style={{ width: "100%", height: "700px" }}>
                        <img
                            onClick={onClick && onClick}
                            src={slideImage}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default DynamicPaginationSwiper;
