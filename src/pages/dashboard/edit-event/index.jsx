import { Box, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { FullWidthImgInput, ImgInputWithCategories, InputWithMap, OutlinedTabs } from '../../../components'
import { eventMain, flag } from '../../../assets'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import Reviews from '../../../components/BESprofiles/reviews'
import { reviews as eventReviews } from '../../../constant'

const EditEvent = () => {
    const theme = useTheme()
    // States and Ref
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [eventName, setEventName] = useState("Ecolux Chic Pop-Up")
    const [categories, setCategories] = useState([
        { name: 'Sustainable Fashion', selected: true, id: 1 },
        { name: 'Real Estate', selected: false, id: 2 },
        { name: 'Technology', selected: false, id: 3 },
        { name: 'Health & Wellness', selected: false, id: 4 },
        { name: 'Education', selected: false, id: 5 },
    ]);
    const [activeTab, setActiveTab] = useState("Details");

    const tabs = [
        { label: "Details", component: <></> },
        { label: "Reviews", component: <></> },
    ];

    const [reviews, setReviews] = useState(eventReviews);

    const [eventOverview, setEventOverview] = useState("A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.\n\nShoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.\n\nThe event will also include workshops on sustainable fashion and personal styling sessions.\n\nVisitors will immerse themselves in a unique shopping experience, discovering the intersection of luxury and eco-conscious fashion. This pop-up is perfect for those looking to elevate their wardrobe while supporting sustainable and ethical design practices.")

    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const defaultTemplate = `<h2>What to Expect</h2><p><strong>Exclusive Collection:</strong>  Shoppers will have the first opportunity to explore and purchase limited-edition, high-end clothing and accessories. Each piece is thoughtfully crafted from organic cotton, recycled fabrics, and other eco-conscious materials. The collection combines timeless elegance with modern trends, offering a perfect blend of luxury and environmental responsibility.</p><br/><p><strong>Workshops & Events:</strong> In addition to shopping, attendees can participate in a series of workshops focused on sustainable fashion. Learn from industry experts about eco-friendly design practices, circular fashion, and how to build a more sustainable wardrobe. Personal styling sessions will also be available, allowing guests to get tailored advice on how to incorporate sustainable pieces into their everyday looks.</p><br/><p><strong>Interactive Displays:</strong> The pop-up will feature interactive displays showcasing the journey of each garment—from the sourcing of raw materials to the sustainable manufacturing processes. Attendees can gain insight into the environmental impact of their fashion choices and discover ways to make more conscious decisions.</p><br/><p><strong>Eco-Friendly Environment:</strong>  The venue itself will reflect the brand’s commitment to sustainability, with eco-friendly decor, recycled packaging for purchases, and zero-waste event practices.</p><br/><h3>Why Attend</h3>This is more than just a shopping event-it's a celebration of sustainable fashion and an opportunity to connect with like-minded individuals who value ethical practices and luxury design. Whether you're a fashion enthusiast, an eco-conscious shopper, or just who curious about sustainable fashion, this pop-up store offers something for everyone.`;
    const [eventTitle, setEventTitle] = useState(defaultTemplate);

    // Functions
    const HandleMainFileInputClick = () => {
        mainImageRef.current.click();
    }
    const HandleMainImageChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
    };

    const HandleProfileFileInputClick = () => {
        mainImageRef.current.click();
    }
    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
    };

    const CategoryChangeHandler = (index) => {
        console.log(index)
        const categoriesSelected = categories?.filter((item) => item?.selected).length;

        if (categoriesSelected === 1 && categories.find((cat) => cat.id === index).selected) {
            alert("Atleast one category should be selected");
            return;
        }

        else if (!categories.find((cat) => cat.id === index).selected && categoriesSelected >= 2) {
            alert("You can select 2 categories at max.")
            return;
        }

        const updatedCategories = categories.map((item, i) =>
            item?.id === index ? { ...item, selected: !item?.selected } : item
        )
        setCategories(updatedCategories);
    }

    useEffect(() => {

        if (quillRef.current) {
            quillRef.current = null;
        }
        setEventTitle(defaultTemplate);
        setIsEditorVisible(false);
    }, [activeTab]);

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


            quillRef.current.root.innerHTML = eventTitle;

            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setEventTitle(updatedContent);
            });
        }
    }, [isEditorVisible, eventTitle]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'Editor') {
            setIsEditorVisible(true);
        }
    };

    const handleApproveChange = (index, isChecked) => {
        setReviews((prevReviews) =>
            prevReviews.map((review, i) =>
                i === index ? { ...review, approved: isChecked } : review
            )
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "32px",
                backgroundColor: "white",
                borderRadius: "5px",
                pb: 2,
                mb: 2,
            }}
        >
            <FullWidthImgInput activity={"event"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={flag} editImage={eventMain} />

            <ImgInputWithCategories
                handleImgClick={HandleProfileFileInputClick}
                imgRef={profileImageRef}
                handleChange={HandleProfileImageChange}
                inputVal={eventName}
                onChange={(e) => setEventName(e.target.value)}
                inputlabel={"event name:"}
                categoryLabel={"event category:"}
                categories={categories}
                description={"1 min - 2 max. Checkbox on the categories will display them publicly."}
                HandleCategoryChange={CategoryChangeHandler}
                activity={"event"}
            />


            <OutlinedTabs tabs={tabs} onTabChange={handleTabChange} />

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
                {
                    activeTab?.label === "Details"
                        ?
                        <>
                            <InputWithMap edit inputLabel={"Event Overview:"} inputValue={eventOverview} setInputValue={setEventOverview} mapDescription={"123 Williamsburg Ave, Brooklyn, NY 11211"} activity={"event"} eventName={"Urban Pop-Up Studio 3B"} eventAddress={"Urban Pop-Up Pavilion"} defaultDate={"2025-02-28"} />

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
                                            dangerouslySetInnerHTML={{ __html: eventTitle }}
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
                        </>
                        :
                        <Box
                            sx={{
                                width: "98%",
                            }}
                        >
                            <Reviews
                                reviews={reviews}
                                showApproveBox={true}
                                onApproveChange={handleApproveChange}
                            />
                        </Box>
                }
            </Box>
        </Box>
    )
}

export default EditEvent
