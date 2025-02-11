import React from 'react'
import DynamicPaginationSwiper from './Slider'

const ImageModal = ({ single, slides }) => {
    return !single ? (
        <DynamicPaginationSwiper
            slides={slides}
        />
    ) : (<img style={{ width: "100%", borderRadius: "10px" }} src={slides[0]} />)
}

export default ImageModal
