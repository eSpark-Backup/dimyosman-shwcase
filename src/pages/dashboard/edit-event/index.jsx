import { Box, Button, CircularProgress, LinearProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs } from '../../../components'
import { eventMain, flag } from '../../../assets'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import Reviews from '../../../components/BESprofiles/reviews'
import { reviews as eventReviews } from '../../../constant'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useEditEventMutation, useGetAllEventsQuery } from '../../../services/events'
import { useGetCategoriesQuery } from '../../../services/categories'
import { useGetAllSpaceQuery } from '../../../services/space'
import { toast } from 'react-toastify'
import ReusableModal from '../../../components/Modal'
import { LoadingButton } from '@mui/lab'
import { fetchAddressFromCoordinates } from '../../../utils'

const EditEvent = () => {
    const navigate = useNavigate();
    const theme = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0);
    const params = useParams();
    const [bookedRanges, setBookedRanges] = useState([])


    const { isError: IsGetCategoryError, isSuccess: GetCategorySuccess, error: GetCategoryError, data: GetCategoryData, isLoading: GetCategoryLoading } = useGetCategoriesQuery('EVENTS')

    const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllEventsQuery({
        page: 1, pageSize: 7, id: params?.eventId
    }, { refetchOnMountOrArgChange: true });

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

    const [eventData, setEventData] = useState({
        cover: [],
        profileImage: null,
        eventName: "",
        eventCategories: [],
        eventOverview: "",
        eventTitle: null,
        location: { lat: 0, long: 0 },
        mapInstructions: "",
        eventDate: "",
        selectedDate: [],
        brand: "",
        space: "",
        streetAddress: ""
    });

    const { data: spaceData, isError: isSpaceError, isLoading: SpaceLoading, isSuccess: isSpaceSuccess, error: spaceError, isFetching: isSpaceFetching } = useGetAllSpaceQuery({ tab: "Space" }, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        const fetchAddress = async () => {
            if (GetCategorySuccess && isSuccess) {
                const allCategories = Array.isArray(GetCategoryData?.data)
                    ? GetCategoryData.data.map((cat, index) => ({
                        id: index,
                        name: cat?.name,
                        selected: false,
                    }))
                    : [];

                const selectedCategories = Array.isArray(data?.data?.eventCategory)
                    ? data?.data?.eventCategory.map((cat) => cat?.name)
                    : [];

                const mergedCategories = allCategories.map((category) => ({
                    ...category,
                    selected: selectedCategories?.includes(category.name),
                }));

                let address = "";
                if (data?.data?.space?.location?.lat && data?.data?.space?.location?.long) {
                    address = await fetchAddressFromCoordinates(
                        data?.data?.space?.location?.lat,
                        data?.data?.space?.location?.long
                    );
                }

                setEventData((prevState) => ({
                    ...prevState,
                    eventCategories: mergedCategories,
                }));
                setEventData((prevState) => ({
                    ...prevState,
                    eventCategories: mergedCategories,
                    eventName: data?.data?.eventName,
                    profileImage: data?.data?.eventImage,
                    eventOverview: data?.data?.details?.description,
                    cover: data?.data?.coverImages,
                    selectedDate: Array.isArray(data?.data?.eventDate) && data?.data?.eventDate[0]
                        ? [
                            new Date(data.data.eventDate[0]?.startDate),
                            new Date(data.data.eventDate[0]?.endDate)
                        ]
                        : [],
                    eventTitle: data?.data?.details?.htmlContent,
                    space: data?.data?.space?.id,
                    location: { lat: data?.data?.space?.location?.lat, long: data?.data?.space?.location?.long },
                    streetAddress: address
                }));
            }
        }
        fetchAddress()
    }, [GetCategorySuccess, isSuccess, data]);
    // States and Ref
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)

    const [openMapModal, setMapModal] = useState(false);

    const spaceOptions = Array.isArray(spaceData?.data?.spaces)
        ? spaceData.data.spaces.map((brand) => ({
            label: brand.spaceName,
            value: brand.id,
            item: brand,
        }))
        : [];

    const [activeTab, setActiveTab] = useState("Details");

    useEffect(() => {
        if (spaceData) {
            if (eventData?.space !== "") {
                const selectedSpace = spaceData?.data?.spaces?.filter((item) => item?.id === eventData?.space)?.[0];

                if (selectedSpace?.calendarEvents?.length > 0) {
                    const bookedDates = selectedSpace.calendarEvents
                        .filter((item) => item?.eventId !== data?.data?.id)
                        .map((item) => ({
                            start: new Date(item?.start),
                            end: new Date(item?.end),
                        }));
                    setBookedRanges(bookedDates);
                }
            }
        }
    }, [spaceData, eventData, eventData?.space])

    const tabs = [
        { label: "Details", component: <></> },
        { label: "Reviews", component: <></> },
    ];

    const [reviews, setReviews] = useState(eventReviews);

    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    // Functions
    const HandleMainFileInputClick = () => {
        mainImageRef.current.click();
    }
    const HandleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const updatedCover = [...eventData.cover];
            updatedCover[currentIndex] = file;
            setEventData((prev) => ({ ...prev, cover: updatedCover }));
        }
    };

    const handleAddImage = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < eventData.cover.length + 1 && nextIndex <= 2) {
            setCurrentIndex(nextIndex);
        }
    };

    const HandleSlideChange = (index) => {
        if (index >= 0 && index <= eventData.cover.length) {
            setCurrentIndex(index);
        }
    };


    const handleRemoveImage = () => {
        const updatedCover = eventData.cover.filter((_, index) => index !== currentIndex);
        setEventData((prev) => ({ ...prev, cover: updatedCover }));
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    }
    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setEventData((prev) => ({
                ...prev,
                profileImage: file,
            }));
        }
    };

    const CategoryChangeHandler = (index) => {
        const categoriesSelected = eventData?.eventCategories?.filter((item) => item?.selected).length;

        if (categoriesSelected === 1 && eventData?.eventCategories.find((cat) => cat.id === index).selected) {
            alert("Atleast one category should be selected");
            return;
        }

        else if (!eventData?.eventCategories.find((cat) => cat.id === index).selected && categoriesSelected >= 2) {
            alert("You can select 2 categories at max.")
            return;
        }

        const updatedCategories = eventData?.eventCategories.map((item, i) =>
            item?.id === index ? { ...item, selected: !item?.selected } : item
        )
        setEventData((prevState) => ({
            ...prevState,
            eventCategories: updatedCategories
        }));
    }

    useEffect(() => {
        if (quillRef.current) {
            quillRef.current = null;
        }
        setEventData((prevState) => ({
            ...prevState,
            eventTitle: prevState?.eventTitle,
        }));

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
            quillRef.current.root.innerHTML = eventData?.eventTitle;
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setEventData((prevData) => ({
                    ...prevData,
                    eventTitle: updatedContent,
                }));
            });
        }
    }, [isEditorVisible, eventData?.eventTitle]);

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

    const handleDateChange = (selectedDate) => {
        if (selectedDate?.length > 0) {
            const formattedStartDate = selectedDate[0]
                ? dayjs(selectedDate[0]).format("DD.MM.YYYY")
                : "dd.mm.yyyy";
            const formattedEndDate = selectedDate[1]
                ? dayjs(selectedDate[1]).format("DD.MM.YYYY")
                : "dd.mm.yyyy";

            setEventData((prev) => ({
                ...prev,
                selectedDate,
                eventDate: `${formattedStartDate} - ${formattedEndDate}`,
            }));
        }
    };

    const [event, { isSuccess: eventPostSuccess, isError: IsEventPostError, error: eventPostError, data: eventPostData }] = useEditEventMutation()

    useEffect(() => {
        if (eventPostSuccess) {
            toast.success(eventPostData?.message)
            navigate("/event")
        }
    }, [eventPostSuccess])

    useEffect(() => {
        if (IsEventPostError) {
            toast.error(eventPostError?.data?.message)
        }
    }, [IsEventPostError])
    const validateEventData = () => {
        if (!eventData?.cover || eventData?.cover?.length <= 0) {
            toast?.error("Please upload cover photo of event");
            return false;
        }

        if (!eventData?.profileImage) {
            toast?.error("Please upload profile photo of event");
            return false;
        }

        if (!eventData?.eventName || eventData?.eventName.trim() === "") {
            toast?.error("Event name can not be empty.");
            return false;
        }

        const selectedCategories = eventData?.eventCategories?.filter((item) => item?.selected);
        if (!selectedCategories || selectedCategories.length <= 0) {
            toast?.error("Please select at least one category.");
            return false;
        }

        if (!eventData?.eventOverview || eventData?.eventOverview.trim() === "") {
            toast?.error("Event overview can not be empty.");
            return false;
        }

        if (!eventData?.eventTitle || eventData?.eventTitle.trim() === "") {
            toast?.error("Event title can not be empty.");
            return false;
        }

        const strippedContent = eventData?.eventTitle?.replace(/<[^>]*>/g, "").trim();
        if (!strippedContent) {
            toast?.error("Event title can not be empty.");
            return false;
        }


        if (!eventData?.space || eventData?.space?.trim() === "") {
            toast?.error("Please select space");
            return false;
        }

        if (!eventData?.selectedDate || eventData?.selectedDate?.includes(null)) {
            toast?.error("Please select date");
            return false;
        }
        return true;
    };

    const handleSubmit = async (status) => {
        if (!validateEventData()) {
            return;
        }
        setLoadingButton(status);
        try {
            await event({ eventData: { ...eventData, status }, id: params?.eventId });
        } finally {
            setLoadingButton(null);
        }
    };

    const [loadingButton, setLoadingButton] = useState(null);
    const HandlePublishSubmit = () => handleSubmit("PUBLISH");
    const HandleDraftSubmit = () => handleSubmit("DRAFT");
    const HandleArchiveSubmit = () => handleSubmit("ARCHIVE");

    useEffect(() => {
        if (spaceData && data) {
            if (eventData.space !== data?.data?.space?.id) {
                const selectedSpaceData = spaceOptions?.filter((item) => item.value === data?.data?.space?.id)
                const updatedLocation = { lat: selectedSpaceData[0]?.item?.location?.lat, long: selectedSpaceData[0]?.item?.location?.long }
                setEventData((prevState) => ({
                    ...prevState,
                    space: data?.data?.space?.id,
                    location: updatedLocation,
                    mapInstructions: selectedSpaceData[0]?.item?.location?.additional
                }));
            }
        }
    }, [isSuccess, isSpaceSuccess]);

    const updateEventData = (key, value) => {
        setEventData((prev) => {
            if (prev[key] === value) {
                return prev;
            }
            return {
                ...prev,
                [key]: value,
            };
        });
    };

    if (isLoading || GetCategoryLoading || isFetching) {
        return (
            <Box sx={{ width: "100%" }}>
                <LinearProgress />
            </Box>
        )
    }

    if (!data?.data) {
        return (
            <Box sx={{ width: "100%" }}>
                <h1>No Data Found</h1>
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
                pb: 2,
                mb: 2,
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
            <FullWidthImgInput activity={"event"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={flag}
                editImage={
                    eventData.cover[currentIndex]?.url
                        ?
                        eventData.cover[currentIndex]?.url
                        :
                        eventData.cover[currentIndex] ?
                            URL.createObjectURL(eventData.cover[currentIndex])
                            :
                            null
                }
                handleAdd={handleAddImage}
                handleRemove={handleRemoveImage}
                currentIndex={currentIndex}
                HandleSlideChange={HandleSlideChange}
            />

            <ImgInputWithCategories
                handleImgClick={HandleProfileFileInputClick}
                imgRef={profileImageRef}
                handleChange={HandleProfileImageChange}
                inputVal={eventData?.eventName}
                onChange={(e) =>
                    setEventData((prev) => ({ ...prev, eventName: e.target.value }))
                }
                inputlabel={"event name:"}
                categoryLabel={"event category:"}
                categories={eventData?.eventCategories}
                description={"1 min - 2 max. Checkbox on the categories will display them publicly."}
                HandleCategoryChange={CategoryChangeHandler}
                activity={"event"}
                imgUrl={eventData?.profileImage}
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
                            <InputWithMap edit inputLabel={"Event Overview:"} inputValue={eventData?.eventOverview} setInputValue={(value) => setEventData({ ...eventData, eventOverview: value })} mapDescription={eventData?.streetAddress} activity={"event"} eventName={"Urban Pop-Up Studio 3B"} eventAddress={"Urban Pop-Up Pavilion"} defaultDate={eventData.selectedDate || [new Date(), new Date()]} onDateChange={handleDateChange}
                                options={spaceOptions}
                                selectedValue={eventData?.space || ''}
                                eventData={eventData}
                                updateEventData={updateEventData}
                                handleClick={() => setMapModal(true)}
                                bookedRanges={bookedRanges}
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
                                            dangerouslySetInnerHTML={{ __html: eventData?.eventTitle }}
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
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <MapModal disabled={true} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[eventData?.location?.lat, eventData?.location?.long]} setBrandData={setEventData} instructionValue={eventData?.mapInstructions}
                    setInstructionValue={(e) => setEventData((prev) => ({
                        ...prev,
                        mapInstructions: e.target.value
                    }))} />
            </ReusableModal>
        </Box>
    )
}

export default EditEvent
