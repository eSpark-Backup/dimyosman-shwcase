import { Box, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { accessibility, arrow, security, spaceIcon, storage, sun, wifi } from '../../../assets';
import { ChoiceSelectionModal, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs, PriceModal } from '../../../components';
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import ReusableModal from '../../../components/Modal';

const NewSpace = () => {
    const theme = useTheme()
    // States
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [spaceName, setSpaceName] = useState("New Space")
    const [categories, setCategories] = useState([
        { name: 'Sustainable Fashion', selected: true, id: 1 },
        { name: 'Real Estate', selected: false, id: 2 },
        { name: 'Technology', selected: false, id: 3 },
        { name: 'Health & Wellness', selected: false, id: 4 },
        { name: 'Education', selected: false, id: 5 },
    ]);
    const [feature, setfeatures] = useState([
        { name: 'Flexible Layout', selected: true, icon: arrow, id: 1 },
        { name: 'Wifi', selected: true, icon: wifi, id: 2 },
        { name: 'Accessible Location', selected: false, icon: accessibility, id: 3 },
        { name: 'Natural Lighting', selected: false, icon: sun, id: 4 },
        { name: 'Compact Storage Area', selected: false, icon: storage, id: 5 },
        { name: 'On-Site Security', selected: true, icon: security, id: 6 },
    ]);
    const [spaceOverview, setSpaceOverview] = useState("Add a brief overview of the space, highlighting its size, location, and key features.\n\nExplain what makes the space ideal for events, pop-ups, or other uses, focusing on its flexibility and amenities. Be sure to mention any standout aspects, such as design, accessibility, or additional services provided (e.g., security, Wi-Fi).\n\nKeep the description informative yet concise, ensuring it appeals to potential users by focusing on what they will benefit from. You can also include a brief note on the atmosphere or style of the space.")
    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const defaultTemplate = `<h2><strong>Space Blog Post Title</strong></h2><p><strong>Flexibility & Uses:</strong>  Explain how the space can be adapted for different events or purposes, such as pop-up shops, exhibitions, or private gatherings. Highlight its versatility, emphasizing how it can be customized to meet different needs. If there are any notable past events or collaborations, mention them here.</p><br/><p><strong>Location & Accessibility:</strong> Provide details about the location of the space and why it’s attractive for potential renters. Mention its proximity to transportation, popular areas, or other attractions that add value. If the location aligns with a theme, such as a creative or eco-friendly neighborhood, include that information to set the tone.</p><br/><p><strong>Atmosphere & Design:</strong>  Briefly describe the overall vibe of the space. Whether it’s modern, industrial, or eco-friendly, explain how the design adds to the experience for those using the space. You can also mention how the space creates a memorable backdrop for events, which can attract more attendees.</p><br/><p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to book or explore the space for their next event. Reiterate the main selling points, such as the space’s flexibility, amenities, and location, and why it’s the perfect venue for a variety of purposes.</p>`;
    const [spaceTitle, setSpaceTitle] = useState(defaultTemplate);

    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [openMapModal, setMapModal] = useState(false);
    const [address, setAddress] = useState("")
    const [priceModal, setPriceModal] = useState(false)




    // Functions
    const HandleMainImageChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
    };
    const HandleMainFileInputClick = () => {
        mainImageRef.current.click();
    }
    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    }
    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
    };
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
    const tabs = [
        { label: "Details", component: <></> },
    ];

    const handleModalOpen = () => {
        setModalOpen(true);
        setSelectedInModal(feature.map(feat => ({ ...feat })));
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

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
            quillRef.current.root.innerHTML = spaceTitle || defaultTemplate;
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setSpaceTitle(updatedContent);
            });
        }
    }, [isEditorVisible]);

    const CategoryChangeHandler2 = (index) => {
        const newFeatures = feature?.map((item, i) =>
            item?.id === index ? { ...item, selected: !item?.selected } : item
        )
        setfeatures(newFeatures);
    }
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
            <FullWidthImgInput activity={"space"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={spaceIcon} />
            <ImgInputWithCategories
                handleImgClick={HandleProfileFileInputClick}
                imgRef={profileImageRef}
                handleChange={HandleProfileImageChange}
                inputVal={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                inputlabel={"event name:"}
                categoryLabel={"space category:"}
                categories={categories}
                description={"1 min - 2 max. Checkbox on the categories will display them publicly."}
                HandleCategoryChange={CategoryChangeHandler}
                activity={"event"}
            />
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
                <InputWithMap inputLabel={"Space Overview:"} inputValue={spaceOverview} setInputValue={setSpaceOverview} mapInstruction={"Click on the map to change/adjust."} mapDescription={"Brand Address is displayed automatically"} activity={"space"} eventName={"Select your Brand"}
                    defaultPrice={"$xxx/day"}
                    handleModalOpen={handleModalOpen}
                    handleClick={() => setMapModal(true)}
                    categories={feature}
                    HandleCategoryChange={CategoryChangeHandler2}
                    HandlePriceModal={() => setPriceModal(true)}
                />
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
                                dangerouslySetInnerHTML={{ __html: spaceTitle }}
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
            <ReusableModal open={modalOpen} handleClose={handleModalClose} heading={"Select Amenities and Features"}>
                <ChoiceSelectionModal
                    categories={feature}
                    handleClose={handleModalClose}
                    onSelect={setfeatures}
                    maxSelections={Infinity}
                    description=''
                />
            </ReusableModal>
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <MapModal value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} />
            </ReusableModal>
            <ReusableModal open={priceModal} handleClose={() => setPriceModal(false)} heading={"Pricing and terms"}>
                <PriceModal handleClose={() => setPriceModal(false)} />
            </ReusableModal>
        </Box>
    )
}

export default NewSpace
