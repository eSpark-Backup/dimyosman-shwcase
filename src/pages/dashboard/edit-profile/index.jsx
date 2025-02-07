import { Box, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { OutlinedTabs, ProfileCard } from "../../../components";
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { brandMain } from '../../../assets';


const EditProfile = () => {
    const theme = useTheme();
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    const defaultTemplate = `<h2><strong>A Passion for Sustainable Fashion</strong></h2><p>Hi, I'm Emily Thompson, founder and designer at EcoLux Designs. For as long as I can remember, I've been passionate about creating beautiful clothing that doesn't come at the expense of our planet. My goal has always been to merge the world of luxury fashion with sustainable practices, offering high-end pieces that not only look incredible but are also made with care for the environment.</p><p>At EcoLux Designs, I work with organic fabrics and recycled materials to ensure every garment is as eco-friendly as it is stylish. I believe that fashion can be both timeless and responsible, and my collections reflect that balance. From the design process to production, I’m committed to reducing waste and promoting ethical practices in every step.</p>
    <img src=${brandMain} style="width:100%" height:auto margin:10px 0px;"/>
    <h2><strong>Leading the Movement Toward Eco-Conscious Fashion</strong></h2><p>Sustainability isn’t just a trend for me—it’s at the core of everything I do. My hope is to inspire others to make more conscious choices in their wardrobes while still enjoying the luxury and elegance that fashion can bring. I love collaborating with like-minded individuals and brands, and I’m always exploring new ways to push the boundaries of what sustainable fashion can achieve.</p>
    `;
    const [brandTitle, setBrandTitle] = useState(defaultTemplate);
    const [brandData, setBrandData] = useState({
        cover: [],
    });
    const [currentIndex, setCurrentIndex] = useState(0);


    const handleMainFileInputClick = () => {
        mainImageRef.current.click();
    };

    const handleMainImageChange = (files) => {
        if (files.length > 0) {
            if (brandData.cover.length === 0) {
                setBrandData((prev) => ({ ...prev, cover: files }));
            }
            if (brandData.cover.length === 1) {
                const updatedCover = [...brandData.cover];
                updatedCover[1] = files[0];
                files?.length > 1 ? updatedCover[2] = files[1] : null;
                setBrandData((prev) => ({ ...prev, cover: updatedCover }));
                const nextIndex = brandData.cover.length;
                if (nextIndex < 3) {
                    setCurrentIndex(nextIndex);
                }
            }
            if (brandData.cover.length === 2) {
                const updatedCover = [...brandData.cover];
                updatedCover[2] = files[0];
                setBrandData((prev) => ({ ...prev, cover: updatedCover }));
                const nextIndex = brandData.cover.length;
                if (nextIndex < 3) {
                    setCurrentIndex(nextIndex);
                }
            }
        }
    };

    const handleAddImage = () => {
        const nextIndex = brandData.cover.length;
        if (nextIndex < 3) {
            setCurrentIndex(nextIndex);
        }
    };


    const handleRemoveImage = () => {
        const updatedCover = brandData.cover.filter((_, index) => index !== currentIndex);
        setBrandData((prev) => ({ ...prev, cover: updatedCover }));
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const HandleSlideChange = (index) => {
        if (index >= 0 && index <= brandData.cover.length) {
            setCurrentIndex(index);
        }
    };

    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    }

    const HandleProfileImageChange = async (event) => {
        const file = event.target.files;
        console.log(file);
    };
    const profileTabs = [
        {
            label: "About",
            component: <></>
        },

    ]

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (isEditorVisible && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'strike'],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }],
                        ['image', 'link'],
                    ],
                },
            });
            quillRef.current.root.innerHTML = brandTitle || defaultTemplate;
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setBrandTitle(updatedContent);
            });
        }
    }, [isEditorVisible]);
    return (
        <Box
            sx={{
                marginTop: { xs: "0px", md: "80px" },
                display: "flex",
                rowGap: "20px",
                flexDirection: "column",
                backgroundColor: "white",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                pb: "10px",
                marginBottom: "10px"
            }}
        >
            <ProfileCard
                isEdit={true}
                profileImgRef={profileImageRef}
                mainImgRef={mainImageRef}
                handleMainImgChange={handleMainImageChange}
                HandleInputCLick={handleMainFileInputClick}
                cover={brandData?.cover}
                editImage={brandData.cover[currentIndex] ? URL.createObjectURL(brandData.cover[currentIndex]) : null}
                handleAdd={handleAddImage}
                handleRemove={handleRemoveImage}
                currentIndex={currentIndex}
                HandleSlideChange={HandleSlideChange}
                handleProfileChange={HandleProfileImageChange}
                handleProfileImgClick={HandleProfileFileInputClick}
            />
            <OutlinedTabs tabs={profileTabs} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Box
                    sx={{
                        width: "98%",
                    }}
                >
                    {
                        !isEditorVisible &&
                        <Box
                            sx={{
                                border: "1px dashed rgb(0, 20, 28, 0.2)",
                                borderRadius: "3px",
                                height: "auto",
                                p: "10px",
                                backgroundColor: "rgb(209, 219, 215, 0.2)",
                                cursor: "text",
                                "& ul, & ol": {
                                    paddingLeft: 2,
                                },
                                "& img": {
                                    maxWidth: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                    borderRadius: "5px"
                                },
                            }}
                            onClick={() => setIsEditorVisible(true)}
                        >
                            <Typography
                                variant="body1"
                                color={theme.palette.primary.main}
                                dangerouslySetInnerHTML={{ __html: brandTitle }}
                            />
                        </Box>
                    }

                    {
                        isEditorVisible &&
                        <Box
                            ref={editorRef}
                            sx={{
                                border: "1px dashed rgb(0, 20, 28, 0.2)",
                                borderRadius: "3px",
                                p: "10px",
                                backgroundColor: "rgb(209, 219, 215, 0.2)",
                                cursor: "text"
                            }}
                            tabIndex={0}
                        >
                        </Box>
                    }

                </Box>
            </Box>
        </Box>
    )
}

export default EditProfile
