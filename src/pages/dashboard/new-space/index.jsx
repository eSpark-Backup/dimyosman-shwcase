import { Box, Button, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { accessibility, arrow, security, spaceIcon, storage, sun, wifi } from '../../../assets';
import { ChoiceSelectionModal, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs, PriceModal } from '../../../components';
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import ReusableModal from '../../../components/Modal';
import { useGetCategoriesQuery } from '../../../services/categories';
import { useGetAllBrandsQuery } from '../../../services/brands';
import { useGetAmenitiesQuery } from '../../../services/amenities';

const NewSpace = () => {
    const theme = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0);

    // States
    const defaultTemplate = `<h2><strong>Space Blog Post Title</strong></h2><p><strong>Flexibility & Uses:</strong>  Explain how the space can be adapted for different events or purposes, such as pop-up shops, exhibitions, or private gatherings. Highlight its versatility, emphasizing how it can be customized to meet different needs. If there are any notable past events or collaborations, mention them here.</p><br/><p><strong>Location & Accessibility:</strong> Provide details about the location of the space and why it’s attractive for potential renters. Mention its proximity to transportation, popular areas, or other attractions that add value. If the location aligns with a theme, such as a creative or eco-friendly neighborhood, include that information to set the tone.</p><br/><p><strong>Atmosphere & Design:</strong>  Briefly describe the overall vibe of the space. Whether it’s modern, industrial, or eco-friendly, explain how the design adds to the experience for those using the space. You can also mention how the space creates a memorable backdrop for events, which can attract more attendees.</p><br/><p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to book or explore the space for their next event. Reiterate the main selling points, such as the space’s flexibility, amenities, and location, and why it’s the perfect venue for a variety of purposes.</p>`;

    const [spaceData, setSpaceData] = useState({
        cover: [],
        profileImage: null,
        spaceName: "New Space",
        spaceCategories: [],
        spaceOverview: "Add a brief overview of the space, highlighting its size, location, and key features.\n\nExplain what makes the space ideal for events, pop-ups, or other uses, focusing on its flexibility and amenities. Be sure to mention any standout aspects, such as design, accessibility, or additional services provided (e.g., security, Wi-Fi).\n\nKeep the description informative yet concise, ensuring it appeals to potential users by focusing on what they will benefit from. You can also include a brief note on the atmosphere or style of the space.",
        spaceTitle: defaultTemplate,
        location: { lat: 30.188760426055236, long: 70.22460937500001 },
        selectedBrand: "",
        price: "",
        amenities: []
    });

    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [openMapModal, setMapModal] = useState(false);
    const [address, setAddress] = useState("")
    const [priceModal, setPriceModal] = useState(false)

    const { isError, isSuccess, error, data, isLoading } = useGetCategoriesQuery('BRANDS')
    const { isError: IsAmenitiesError, isSuccess: AmeitiesSuccess, error: AmenitiesError, data: AmenitiesData, isLoading: AmenitiesLoading } = useGetAmenitiesQuery()
    const { data: brandData, isError: IsBrandError, isLoading: IsBrandLoading, isSuccess: IsBrandSuccess, error: BrandError } = useGetAllBrandsQuery({}, { refetchOnMountOrArgChange: true });


    useEffect(() => {
        if (isError) {
            console.log(error);
        }
    }, [isError]);

    useEffect(() => {
        if (isSuccess) {
            const updatedCategories = data?.data.map((category) => ({
                id: category.id,
                name: category.name,
                selected: false
            }));


            setSpaceData((prevState) => ({
                ...prevState,
                spaceCategories: updatedCategories
            }));
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (AmeitiesSuccess) {
            const updatedAmenities = AmenitiesData?.data.map((amenity) => ({
                id: amenity.id,
                name: amenity.amenitiesName,
                selected: false,
                icon: amenity.amenitiesImage,
            }));

            setSpaceData((prevState) => ({
                ...prevState,
                amenities: updatedAmenities,
            }));
        }
    }, [AmeitiesSuccess, AmenitiesData]);



    // Functions
    const HandleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const updatedCover = [...spaceData.cover];
            updatedCover[currentIndex] = file;
            setSpaceData((prev) => ({ ...prev, cover: updatedCover }));
        }
    };

    const HandleMainFileInputClick = () => {
        if (spaceData.cover.length < 3) mainImageRef.current.click();
    };

    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    }

    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setSpaceData((prev) => ({
                ...prev,
                profileImage: file,
            }));
        }
    };

    const handleAddImage = () => {
        if (spaceData.cover.length < 3) {
            setCurrentIndex(spaceData.cover.length);
        }
    };

    const handleRemoveImage = () => {
        const updatedCover = spaceData.cover.filter((_, index) => index !== currentIndex);
        setSpaceData((prev) => ({ ...prev, cover: updatedCover }));
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const CategoryChangeHandler = (index) => {
        const categoriesSelected = spaceData?.spaceCategories?.filter((cat) => cat.selected).length;

        if (spaceData?.spaceCategories?.find((cat) => cat.id === index).selected && categoriesSelected === 1) {
            alert("Atleast one category should be selected");
            return;
        }
        if (!spaceData?.spaceCategories?.find((cat) => cat.id === index).selected && categoriesSelected >= 2) {
            alert("You can select 2 categories at max.");
            return;
        }

        const newCategories = spaceData?.spaceCategories?.map((cat, i) =>
            cat?.id === index ? { ...cat, selected: !cat.selected } : cat
        )
        setSpaceData({ ...spaceData, spaceCategories: newCategories });
    }
    const tabs = [
        { label: "Details", component: <></> },
    ];

    const handleModalOpen = () => {
        setModalOpen(true);
        // setSelectedInModal(feature.map(feat => ({ ...feat })));
        setSelectedInModal(spaceData?.amenities.map(feat => ({ ...feat })));        
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
                        [{ 'header': 3 }],
                        ['bold', 'italic', 'strike'],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }],
                        ['image', 'link'],
                    ],
                },
            });

            // Initialize Quill with brandTitle from brandData
            quillRef.current.root.innerHTML = spaceData?.spaceTitle || defaultTemplate;

            // Update brandData's brandTitle on text change
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setSpaceData((prevData) => ({
                    ...prevData,
                    spaceTitle: updatedContent,
                }));
            });
        }
    }, [isEditorVisible, spaceData?.spaceTitle]);

    const CategoryChangeHandler2 = (index) => {
        const amenitiesSelected = spaceData?.amenities?.filter((item) => item.selected).length;
        if (spaceData?.amenities?.find((item) => item.id === index)?.selected && amenitiesSelected === 1) {
            alert("At least one amenity should be selected.");
            return;
        }    
        const newFeatures = spaceData?.amenities?.map((item) =>
            item?.id === index ? { ...item, selected: !item?.selected } : item
        );
    
        setSpaceData((prevData) => ({
            ...prevData,
            amenities: newFeatures,
        }));
    };
    

    const options = brandData?.data?.brands?.map((brand) => ({
        label: brand.brandName,
        value: brand.id,
        item: brand,
    }));

    const handleBrandSelect = (value) => {
        const selectedItem = options.find((option) => option.value === value);

        setSpaceData((prev) => ({
            ...prev,
            selectedBrand: selectedItem?.item,
        }));
    };

    const HandlePriceSelect = (item) => {
        setPriceModal(false)
        setSpaceData((prevState) => ({
            ...prevState,
            price: item[0]
        }));
    }

    const setfeatures = (selectedAmenities) => {
        setSpaceData((prevState) => ({
            ...prevState,
            amenities: prevState.amenities.map((amenity) => {
                const matchedItem = selectedAmenities.find((selected) => selected.id === amenity.id);
                return matchedItem ? { ...amenity, selected: matchedItem.selected } : amenity;
            }),
        }));
    };    
    

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
            <Box
                sx={{
                    position: "sticky",
                    alignSelf: "flex-end",
                    top: "16px",
                    display: "flex",
                    columnGap: "10px",
                    width: "max-content",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99,
                    right: 0,
                    marginRight: "16px",
                }}
                className="buttons-box"
            >
                <Button
                    sx={{
                        fontSize: "16px",
                        width: "143px",
                        height: "31px",
                        textTransform: "none",
                    }}
                >
                    Save as Draft
                </Button>
                <Button
                    sx={{
                        fontSize: "16px",
                        width: "103px",
                        height: "31px",
                        backgroundColor: "rgb(0, 20, 28, 0.9)",
                        textTransform: "none",
                    }}
                    onClick={() => console.log(spaceData)}
                >
                    Publish
                </Button>
                <Button
                    sx={{
                        fontSize: "16px",
                        width: "102px",
                        height: "31px",
                        textTransform: "none",
                    }}
                >
                    Archive
                </Button>
            </Box>
            <FullWidthImgInput activity={"space"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={spaceIcon} editImage={spaceData.cover[currentIndex] ? URL.createObjectURL(spaceData.cover[currentIndex]) : null} handleAdd={handleAddImage}
                handleRemove={handleRemoveImage}
                currentIndex={currentIndex} />

            <ImgInputWithCategories
                handleImgClick={HandleProfileFileInputClick}
                imgRef={profileImageRef}
                handleChange={HandleProfileImageChange}
                inputVal={spaceData?.spaceName}
                onChange={(e) =>
                    setSpaceData((prev) => ({ ...prev, spaceName: e.target.value }))
                }
                inputlabel={"event name:"}
                categoryLabel={"space category:"}
                categories={spaceData?.spaceCategories}
                description={"1 min - 2 max. Checkbox on the categories will display them publicly."}
                HandleCategoryChange={CategoryChangeHandler}
                activity={"space"}
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
                <InputWithMap inputLabel={"Space Overview:"} inputValue={spaceData?.spaceOverview} setInputValue={(value) => setSpaceData({ ...spaceData, spaceOverview: value })} mapInstruction={"Click on the map to change/adjust."} mapDescription={"Brand Address is displayed automatically"} activity={"space"} eventName={"Select your Brand"}
                    defaultPrice={spaceData?.price === "" ? "$xxx/day" : spaceData?.price?.price + "/" + spaceData?.price?.term}
                    handleModalOpen={handleModalOpen}
                    handleClick={() => setMapModal(true)}
                    categories={spaceData?.amenities}
                    HandleCategoryChange={CategoryChangeHandler2}
                    HandlePriceModal={() => setPriceModal(true)}
                    options={options}
                    onBrandSelect={handleBrandSelect}
                    selectedValue={spaceData?.selectedBrand?.id || ''}
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
                                dangerouslySetInnerHTML={{ __html: spaceData?.spaceTitle }}
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
                    categories={spaceData?.amenities}
                    handleClose={handleModalClose}
                    onSelect={setfeatures}
                    maxSelections={Infinity}
                    description=''
                />
            </ReusableModal>
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <MapModal value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[spaceData?.location?.lat, spaceData?.location?.long]} />
            </ReusableModal>
            <ReusableModal open={priceModal} handleClose={() => setPriceModal(false)} heading={"Pricing and terms"}>
                <PriceModal handleClose={HandlePriceSelect} />
            </ReusableModal>
        </Box>
    )
}

export default NewSpace
