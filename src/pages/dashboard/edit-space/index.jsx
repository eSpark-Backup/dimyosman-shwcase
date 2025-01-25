import { Box, Button, CircularProgress, LinearProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { accessibility, arrow, security, spaceIcon, storage, sun, wifi } from '../../../assets';
import { ChoiceSelectionModal, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs, PriceModal } from '../../../components';
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import ReusableModal from '../../../components/Modal';
import { useGetCategoriesQuery } from '../../../services/categories';
import { useGetAllBrandsQuery } from '../../../services/brands';
import { useGetAmenitiesQuery } from '../../../services/amenities';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useEditSpaceMutation, useGetAllSpaceQuery, useNewSpaceMutation } from '../../../services/space';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAddressFromCoordinates } from '../../../utils';

const EditSpace = () => {
    const theme = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0);
    const params = useParams();
    const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllSpaceQuery({
        page: 1, pageSize: 7, id: params?.spaceId
    }, { refetchOnMountOrArgChange: true });
    // States

    const [spaceData, setSpaceData] = useState({
        cover: [],
        profileImage: null,
        spaceName: "",
        spaceCategories: [],
        spaceOverview: "",
        spaceTitle: null,
        location: {},
        selectedBrand: "",
        price: [],
        amenities: [],
        mapInstructions: "",
        streetAddress: ""
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
    const navigate = useNavigate()

    const { isError: IsGetCategoryError, isSuccess: GetCategorySuccess, error: GetCategoryError, data: GetCategoryData, isLoading: GetCategoryLoading, isFetching: CategoryFetching } = useGetCategoriesQuery('SPACES')

    const { isError: IsAmenitiesError, isSuccess: AmeitiesSuccess, error: AmenitiesError, data: AmenitiesData, isLoading: AmenitiesLoading, isFetching: AmenitiesFetching } = useGetAmenitiesQuery()
    const { data: brandData, isError: IsBrandError, isLoading: IsBrandLoading, isSuccess: IsBrandSuccess, error: BrandError, isFetching: IsBrandFetching } = useGetAllBrandsQuery({}, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (isError) {
            toast.error(error)
        }
    }, [isError])

    useEffect(() => {
        if (IsGetCategoryError) {
            toast.error(GetCategoryError?.message)
        }
    }, [IsGetCategoryError])

    useEffect(() => {
        const fetchAddress = async () => {
            if (
                GetCategorySuccess &&
                isSuccess &&
                AmeitiesSuccess &&
                IsBrandSuccess &&
                GetCategoryData?.data &&
                AmenitiesData?.data &&
                data?.data
            ) {
                const allCategories = GetCategoryData?.data?.map((cat, index) => ({
                    id: index,
                    name: cat?.name,
                    selected: false,
                }));
                const allAmenities = AmenitiesData?.data?.map((amenity, index) => ({
                    id: index,
                    name: amenity?.amenitiesName,
                    selected: false,
                    icon: amenity?.amenitiesImage
                }));

                const selectedCategories = data?.data?.spaceCategory?.map((cat) => cat?.name);

                const mergedCategories = allCategories.map((category) => ({
                    ...category,
                    selected: selectedCategories?.includes(category.name),
                }));

                const selectedAmenity = data?.data?.amenity?.map((amenity) => amenity?.name);

                const mergedAmenities = allAmenities.map((amenity) => ({
                    ...amenity,
                    selected: selectedAmenity?.includes(amenity.name),
                }));

                let address = "";
                if (data?.data?.location?.lat && data?.data?.location?.long) {
                    address = await fetchAddressFromCoordinates(
                        data?.data?.location?.lat,
                        data?.data?.location?.long
                    );
                }

                setSpaceData({
                    cover: data?.data?.coverImages || [],
                    profileImage: data?.data?.spaceImage || null,
                    spaceName: data?.data?.spaceName || "",
                    spaceCategories: mergedCategories || [],
                    spaceOverview: data?.data?.details?.description || "",
                    spaceTitle: data?.data?.details?.htmlContent || null,
                    location: {
                        lat: data?.data?.location?.lat || null,
                        long: data?.data?.location?.long || null,
                    },
                    selectedBrand: data?.data?.brand?.id || "",
                    price: data?.data?.pricing || [],
                    amenities: mergedAmenities || [],
                    mapInstructions: data?.data?.location?.additional || "",
                    streetAddress: address
                });
            }
        }
        fetchAddress()
    }, [GetCategorySuccess, isSuccess, AmeitiesSuccess, IsBrandSuccess, GetCategoryData, AmenitiesData, data]);


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
        mainImageRef.current.click();
    };

    const HandleSlideChange = (index) => {
        if (index >= 0 && index <= spaceData.cover.length) {
            setCurrentIndex(index);
        }
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
        const nextIndex = currentIndex + 1;
        if (nextIndex < spaceData.cover.length + 1 && nextIndex <= 2) {
            setCurrentIndex(nextIndex);
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
        // setSelectedInModal(spaceData?.amenities.map(feat => ({ ...feat })));
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
            quillRef.current.root.innerHTML = spaceData?.spaceTitle;
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


    const options = brandData?.data?.groupedBrands?.publishedBrands?.map((brand) => ({
        label: brand.brandName,
        value: brand.id,
        item: brand,
    }));

    const HandlePriceSelect = (item) => {
        setPriceModal(false)
        setSpaceData((prevState) => ({
            ...prevState,
            price: item
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

    const updateSpaceData = (key, value) => {
        setSpaceData((prev) => {
            if (prev[key] === value) {
                return prev;
            }
            return {
                ...prev,
                [key]: value,
            };
        });
    };

    const [space, { isSuccess: spacePostSuccess, isError: IsSpacePostError, error: spacePostError, data: spacePostData, isLoading: SpacePostingLoading }] = useEditSpaceMutation()

    useEffect(() => {
        if (spacePostSuccess) {
            toast.success(spacePostData?.message)
            navigate("/space")
        }
    }, [spacePostSuccess])

    useEffect(() => {
        if (IsSpacePostError) {
            toast.error(spacePostError?.data?.message)
            return
        }
    }, [IsSpacePostError])

    const validateSpaceData = () => {
        if (!spaceData?.cover || spaceData?.cover?.length <= 0) {
            toast?.error("Please upload cover photo of space");
            return false;
        }

        if (!spaceData?.profileImage) {
            toast?.error("Please upload profile photo of space");
            return false;
        }

        if (!spaceData?.spaceName || spaceData?.spaceName.trim() === "") {
            toast?.error("Space name can not be empty.");
            return false;
        }

        const selectedCategories = spaceData?.spaceCategories
            ?.filter((item) => item?.selected);
        if (!selectedCategories || selectedCategories.length <= 0) {
            toast?.error("Please select at least one category.");
            return false;
        }

        const selectedAmenities = spaceData?.amenities
            ?.filter((item) => item?.selected);
        if (!selectedAmenities || selectedAmenities.length <= 0) {
            toast?.error("Please select at least one amenity.");
            return false;
        }

        if (!spaceData?.spaceOverview
            || spaceData?.spaceOverview
                .trim() === "") {
            toast?.error("Space overview can not be empty.");
            return false;
        }

        if (!spaceData?.spaceTitle || spaceData?.spaceTitle.trim() === "") {
            toast?.error("Space title can not be empty.");
            return false;
        }

        const strippedContent = spaceData?.spaceTitle?.replace(/<[^>]*>/g, "").trim();
        if (!strippedContent) {
            toast?.error("Space title can not be empty.");
            return false;
        }


        if (!spaceData?.selectedBrand || spaceData?.selectedBrand?.trim() === "") {
            toast?.error("Please select brand");
            return false;
        }

        const dayFilter = spaceData?.price?.filter((item) => item?.term === "Day")
        if (!spaceData?.price || spaceData?.price?.length === 0 || dayFilter?.length === 0) {
            toast.error("Please fill out price and minimum with whole numbers greater than or equal to 1 for all selected items.");
            return false;
        }

        if (!spaceData?.
            mapInstructions
            || spaceData?.mapInstructions.trim() === "") {
            toast?.error("Map additional field is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (status) => {
        if (!validateSpaceData()) {
            return;
        }
        setLoadingButton(status);
        try {
            await space({ spaceData: { ...spaceData, status }, id: params?.spaceId });
        } finally {
            setLoadingButton(null);
        }
    };

    const [loadingButton, setLoadingButton] = useState(null);
    const HandlePublishSubmit = () => handleSubmit("PUBLISH");
    const HandleDraftSubmit = () => handleSubmit("DRAFT");
    const HandleArchiveSubmit = () => handleSubmit("ARCHIVE");

    if (IsBrandLoading || AmenitiesLoading || isLoading || GetCategoryLoading || isFetching || IsBrandFetching || AmenitiesFetching || CategoryFetching) {
        return (
            <Box sx={{ width: "100%" }}>
                <LinearProgress />
            </Box>
        )
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
                    zIndex: 10,
                    right: 0,
                    marginRight: "16px",
                }}
                className="buttons-box"
            >
                <LoadingButton
                    sx={{
                        fontSize: "16px",
                        width: "143px",
                        height: "31px",
                        textTransform: "none",
                    }}
                    loading={loadingButton === "DRAFT"}
                    onClick={HandleDraftSubmit}
                    loadingIndicator={<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />}
                    disabled={loadingButton && loadingButton !== "DRAFT"}
                >
                    Save as Draft
                </LoadingButton>
                <LoadingButton
                    sx={{
                        fontSize: "16px",
                        width: "103px",
                        height: "31px",
                        backgroundColor: "rgb(0, 20, 28, 0.9)",
                        textTransform: "none",
                    }}
                    loading={loadingButton === "PUBLISH"}
                    onClick={HandlePublishSubmit}
                    loadingIndicator={<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />}
                    disabled={loadingButton && loadingButton !== "PUBLISH"}
                >
                    Publish
                </LoadingButton>
                <LoadingButton
                    sx={{
                        fontSize: "16px",
                        width: "102px",
                        height: "31px",
                        textTransform: "none",
                    }}
                    loading={loadingButton === "ARCHIVE"}
                    onClick={HandleArchiveSubmit}
                    loadingIndicator={<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />}
                    disabled={loadingButton && loadingButton !== "ARCHIVE"}
                >
                    Archive
                </LoadingButton>
            </Box>
            <FullWidthImgInput activity={"space"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={spaceIcon} editImage={
                spaceData.cover[currentIndex]?.url
                    ?
                    spaceData.cover[currentIndex]?.url
                    :
                    spaceData.cover[currentIndex] ?
                        URL.createObjectURL(spaceData.cover[currentIndex])
                        :
                        null
            } handleAdd={handleAddImage}
                handleRemove={handleRemoveImage}
                currentIndex={currentIndex}
                HandleSlideChange={HandleSlideChange}
            />

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
                imgUrl={spaceData?.profileImage}
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
                <InputWithMap inputLabel={"Space Overview:"} inputValue={spaceData?.spaceOverview} setInputValue={(value) => setSpaceData({ ...spaceData, spaceOverview: value })} mapInstruction={"Click on the map to change/adjust."} mapDescription={spaceData?.streetAddress} activity={"space"} eventName={"Select your Brand"}
                    defaultPrice={
                        spaceData?.price?.length > 0
                            ? spaceData.price : "xxx/day"
                    }
                    handleModalOpen={handleModalOpen}
                    handleClick={() => setMapModal(true)}
                    categories={spaceData?.amenities}
                    HandleCategoryChange={CategoryChangeHandler2}
                    HandlePriceModal={() => setPriceModal(true)}
                    options={options}
                    eventData={spaceData}
                    updateEventData={updateSpaceData}
                    selectedValue={spaceData?.selectedBrand || ''}
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
                                sx={{
                                    "& ul, & ol": {
                                        paddingLeft: 2,
                                    },
                                    "& img": {
                                        maxWidth: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                    },
                                }}
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
                <MapModal disabled={true} value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[spaceData?.location?.lat, spaceData?.location?.long]} instructionValue={spaceData?.mapInstructions}
                    setInstructionValue={(e) => setSpaceData((prev) => ({
                        ...prev,
                        mapInstructions: e.target.value
                    }))} setBrandData={setSpaceData} />
            </ReusableModal>
            <ReusableModal open={priceModal} handleClose={() => setPriceModal(false)} heading={"Pricing and terms"}>
                <PriceModal handleClose={HandlePriceSelect} data={spaceData?.price} />
            </ReusableModal>
        </Box>
    )
}

export default EditSpace
