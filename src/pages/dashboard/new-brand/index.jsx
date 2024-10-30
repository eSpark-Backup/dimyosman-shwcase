import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { brandIcon, locationIcon, modalMap } from '../../../assets'
import Input from '../../../components/input'
import ReusableModal from '../../../components/Modal'
import { ChoiceSelectionModal, FullWidthImgInput, ImgInputWithCategories, InputWithMap } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';


const NewBrand = () => {
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [brandName, setBrandName] = useState("NEW BRAND")
    const [brandOverview, setBrandOverview] = useState("Add a brief brand overview that highlights the core aspects of the brand.\n\nClearly explain the brand’s mission, what makes it unique, and why it stands out in the market. Mention key products or services, emphasizing any unique selling points or values the brand embodies (e.g., sustainability, luxury, innovation).\n \nKeep it concise and informative, focusing on the brand’s identity and what customers can expect. \n\nThis description will be used as an excerpt.")

    const HandleMainFileInputClick = () => {
        mainImageRef.current.click();
    }

    const HandleMainImageChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
    };

    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    }

    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
    };

    const [categories, setCategories] = useState([
        { name: 'Sustainable Fashion', selected: true },
        { name: 'Real Estate', selected: true },
        { name: 'Technology', selected: false },
        { name: 'Health & Wellness', selected: false },
        { name: 'Education', selected: false },
        { name: 'Finance', selected: false },
        { name: 'Travel', selected: false },
        { name: 'Food & Beverage', selected: false },
        { name: 'Art & Design', selected: false },
        { name: 'Sports', selected: false },
        { name: 'Entertainment', selected: false },
        { name: 'Automotive', selected: false },
        { name: 'Gaming', selected: false },
        { name: 'Lifestyle', selected: false },
        { name: 'Science & Technology', selected: false },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [openMapModal, setMapModal] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
        setSelectedInModal(categories.map(cat => ({ ...cat })));
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const selectedCategories = categories.filter(cat => cat.selected);

    // Default template with bold and line breaks
    const defaultTemplate = `<h2><strong>Brand Blog Post Title</strong></h2>
        <p><strong>Product or Service Offerings:</strong> Describe the brand’s main products or services. Focus on what makes these offerings unique, whether it’s quality, design, or innovation. Be sure to explain how these products or services meet customer needs and why they stand out compared to competitors. Including images of products or services can enhance this section.</p>
        <p><strong>Customer Experience & Engagement:</strong> If the brand offers personalized customer experiences, loyalty programs, or community engagement initiatives, explain how these efforts benefit customers. Highlight any opportunities for interaction, such as special events, collaborations, or partnerships. Keep the focus on the value added for the brand’s audience.</p>
        <p><strong>Brand Presence & Identity:</strong> Briefly describe the brand’s presence in the market, including its history or any notable achievements. Discuss how the brand’s identity aligns with current trends or consumer values, like sustainability or luxury. Including images or visuals that represent the brand’s aesthetics can help set the tone.</p>
        <p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to explore the brand’s offerings, visit the website, or follow on social media for updates. Reiterate what makes the brand special and why it should be a go-to choice for consumers.</p>`;
    const [brandTitle, setBrandTitle] = useState(defaultTemplate);
    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (isEditorVisible && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'strike'],
                        [{ 'header': 3 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
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
                display: "flex",
                flexDirection: "column",
                rowGap: "32px",
                backgroundColor: "white",
                borderRadius: "5px",
                pb: "40px"
            }}
        >
            <FullWidthImgInput HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={brandIcon} />
            <ImgInputWithCategories
                handleImgClick={HandleProfileFileInputClick}
                imgRef={profileImageRef}
                handleChange={HandleProfileImageChange}
                inputVal={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                inputlabel={"brand name:"}
                categoryLabel={"brand category:"}
                categories={selectedCategories}
                handleModalOpen={handleModalOpen}
                description={"1 min - 5 max. Checkbox on the categories will display them publicly. All added Brand categories are inherited by Events and Spaces, allowing them for individual selection."}
            />
            <ReusableModal open={modalOpen} handleClose={handleModalClose} heading={"Select Brand Categories"}>
                <ChoiceSelectionModal
                    categories={categories}
                    handleClose={handleModalClose}
                    onSelect={setCategories}
                />
            </ReusableModal>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    rowGap: "32px",
                }}
            >
                <InputWithMap inputLabel={"Brand Overview:"} inputValue={brandOverview} setInputValue={setBrandOverview} handleClick={() => setMapModal(true)} />
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
                                cursor: "text"
                            }}
                            onClick={() => setIsEditorVisible(true)}
                        >
                            <Typography variant="body1" color="#00141C">
                                {brandTitle.replace(/<[^>]*>/g, '')}
                            </Typography>
                        </Box>
                    }

                    {
                        isEditorVisible &&
                        <Box
                            ref={editorRef}
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                left: '0px',
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
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <Input type={"text"} placeholder={"Type Address..."} endAdornment={<InputAdornment position="end">
                    <IconButton>
                        <img src={locationIcon} alt="" />
                    </IconButton>
                </InputAdornment>} />
                <img src={modalMap} alt='Modal Map' />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "3px"
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            textAlign: "left",
                            color: "#00141C",
                            fontWeight: "600"
                        }}
                    >
                        <span style={{ fontWeight: "300" }}>Selected Address: </span>
                        123 Williamsburg Ave, Brooklyn, NY 11211
                    </Typography>
                    <Input type={"text"} placeholder={"Additional instructions like entrances, flores..."} />

                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        sx={{
                            height: "31px",
                            width: "92px",
                            background: "rgba(209, 219, 215, 0.4)",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#00141C",
                            "&:hover": {
                                backgroundColor: "rgba(209, 219, 215, 0.4)"
                            }
                        }}
                        onClick={() => setMapModal(false)}
                    >
                        Select
                    </Button>
                </Box>
            </ReusableModal>
        </Box>
    )
}

export default NewBrand
