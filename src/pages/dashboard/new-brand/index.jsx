import { Box, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { brandIcon } from '../../../assets'
import ReusableModal from '../../../components/Modal'
import { ChoiceSelectionModal, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';


const NewBrand = () => {
    const theme = useTheme();
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [brandName, setBrandName] = useState("NEW BRAND")
    const [brandOverview, setBrandOverview] = useState("Add a brief brand overview that highlights the core aspects of the brand.\n\nClearly explain the brand’s mission, what makes it unique, and why it stands out in the market. Mention key products or services, emphasizing any unique selling points or values the brand embodies (e.g., sustainability, luxury, innovation).\n \nKeep it concise and informative, focusing on the brand’s identity and what customers can expect. \n\nThis description will be used as an excerpt.")
    const [address, setAddress] = useState("")

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
        { id: 1, name: 'Sustainable Fashion', selected: true },
        { id: 2, name: 'Real Estate', selected: true },
        { id: 3, name: 'Technology', selected: false },
        { id: 4, name: 'Health & Wellness', selected: false },
        { id: 5, name: 'Education', selected: false },
        { id: 6, name: 'Finance', selected: false },
        { id: 7, name: 'Travel', selected: false },
        { id: 8, name: 'Food & Beverage', selected: false },
        { id: 9, name: 'Art & Design', selected: false },
        { id: 10, name: 'Sports', selected: false },
        { id: 11, name: 'Entertainment', selected: false },
        { id: 12, name: 'Automotive', selected: false },
        { id: 13, name: 'Gaming', selected: false },
        { id: 14, name: 'Lifestyle', selected: false },
        { id: 15, name: 'Science & Technology', selected: false },
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
        </br><p><strong>Customer Experience & Engagement:</strong> If the brand offers personalized customer experiences, loyalty programs, or community engagement initiatives, explain how these efforts benefit customers. Highlight any opportunities for interaction, such as special events, collaborations, or partnerships. Keep the focus on the value added for the brand’s audience.</p>
        </br><p><strong>Brand Presence & Identity:</strong> Briefly describe the brand’s presence in the market, including its history or any notable achievements. Discuss how the brand’s identity aligns with current trends or consumer values, like sustainability or luxury. Including images or visuals that represent the brand’s aesthetics can help set the tone.</p>
        </br><p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to explore the brand’s offerings, visit the website, or follow on social media for updates. Reiterate what makes the brand special and why it should be a go-to choice for consumers.</p>`;
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
                        [{ 'header': 3 }],
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

    const tabs = [
        { label: "Details", component: <></> },
    ];

    const CategoryChangeHandler = (index) => {
        const categoriesSelected = categories.filter((cat) => cat.selected).length;

        if (categories.find((cat) => cat.id === index).selected && categoriesSelected === 1) {
            alert("Atleast one category should be selected");
            return;
        }
        if (!categories.find((cat) => cat.id === index).selected && categoriesSelected >= 2) {
            alert("You can select 2 categories at max.");
            return;
        }

        const newCategories = categories.map((cat, i) =>
            cat?.id === index ? { ...cat, selected: !cat.selected } : cat
        )
        setCategories(newCategories);
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "32px",
                backgroundColor: "white",
                borderRadius: "5px",
                pb: 2,
            }}
        >
            <FullWidthImgInput activity={"brand"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={brandIcon} />
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
                activity={"brand"}
                HandleCategoryChange={CategoryChangeHandler}
            />
            <ReusableModal open={modalOpen} handleClose={handleModalClose} heading={"Select Brand Categories"}>
                <ChoiceSelectionModal
                    categories={categories}
                    handleClose={handleModalClose}
                    onSelect={setCategories}
                />
            </ReusableModal>
            <OutlinedTabs tabs={tabs} />
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
                <InputWithMap inputLabel={"Brand Overview:"} inputValue={brandOverview} setInputValue={setBrandOverview} handleClick={() => setMapModal(true)} activity={"brand"} mapDescription={"123 Williamsburg Ave, Brooklyn, NY 11211"} mapInstruction={"Click on the map to select Address."} />
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
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <MapModal value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} />
            </ReusableModal>
        </Box>
    )
}

export default NewBrand
