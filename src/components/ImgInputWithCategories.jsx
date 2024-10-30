import { Box, Checkbox, Typography } from '@mui/material'
import React from 'react'
import { add, subtract, uploadIcon } from '../assets'
import Input from './input'

const ImgInputWithCategories = ({ handleImgClick, imgRef, handleChange, inputVal, onChange, inputlabel, categoryLabel, categories, handleModalOpen, description }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: "98%",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    columnGap: "30px"
                }}
            >
                <Box
                    sx={{
                        height: "96px",
                        width: "96px",
                        border: "1px dashed rgb(0, 20, 28, 0.4)",
                        backgroundColor: "rgb(209, 219, 215, 0.2)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        pt: "15px"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "0px",
                            cursor: "pointer"
                        }}
                        onClick={handleImgClick}
                    >
                        <Typography
                            sx={{
                                fontSize: '14px',
                                fontWeight: "300",
                                color: "#00141C",
                                fontStyle: "italic"
                            }}
                        >
                            upload image:
                        </Typography>
                        <img src={uploadIcon} alt="Icon" />
                        <input type="file" style={{ display: "none" }} ref={imgRef} onChange={handleChange} />
                    </Box>

                </Box>
                <Box
                    sx={{
                        width: { xs: "100%", md: "90%" },
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "10px",
                    }}
                >
                    <Input label={inputlabel} type={"text"} value={inputVal} onInputChange={onChange} sx={{ fontSize: "32px", fontWeight: "600", height: "54px" }} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "8px"
                        }}
                    >
                        <Typography
                            sx={{ fontStyle: "italic", textAlign: "left", fontWeight: 300, color: "#00141C" }}
                            variant="h6"
                        >
                            {categoryLabel}
                        </Typography>
                        <Box
                            sx={{
                                height: "112px",
                                border: "1px dashed rgb(0, 20, 28, 0.4)",
                                backgroundColor: "rgb(209, 219, 215, 0.2)",
                                position: "relative",
                                p: "10px 15px",
                                overflowY: "auto"
                            }}
                        >
                            <Box
                                sx={{
                                    width: "95%",
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}
                            >
                                {categories?.length > 0 ? (
                                    categories?.map((cat) => (
                                        <Box key={cat.name} display="flex" alignItems="center" marginRight={2} columnGap={0}>
                                            <Checkbox checked={cat?.selected} readOnly />
                                            <Typography sx={{ fontSize: "20px", fontWeight: "300", color: "#00141C" }}>{cat?.name}</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography>No categories selected.</Typography>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    display: "flex",
                                    columnGap: "10px"
                                }}
                            >
                                <img src={add} alt="Add Icon" style={{ cursor: "pointer" }} onClick={handleModalOpen} />
                                <img src={subtract} alt="Subtract Icon" style={{ cursor: "pointer" }} onClick={handleModalOpen} />
                            </Box>
                        </Box>
                        <Typography sx={{ fontSize: "14px", color: "#00141C", fontStyle: "italic" }}>
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ImgInputWithCategories
