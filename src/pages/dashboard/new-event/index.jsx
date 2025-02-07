import { Box, Button, CircularProgress, LinearProgress, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { flag } from '../../../assets'
import { FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { useTheme } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import ReusableModal from '../../../components/Modal'
import dayjs from 'dayjs'
import { useGetAllBrandsQuery } from '../../../services/brands'
import { useGetCategoriesQuery } from '../../../services/categories'
import { useGetAllSpaceQuery, useSpacesForEventQuery } from '../../../services/space'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useNewEventMutation } from '../../../services/events'

const NewEvent = () => {
    const defaultTemplate = `<h2><strong>Event Blog Post Title</strong></h2><p><strong>Main Features:</strong> Highlight the key aspects of the event. This could include exclusive offers, workshops, activities, or special guests. Be sure to describe what attendees can expect and why it’s valuable to them. Adding images to this section can make it more visually appealing.</p><br/><p><strong>Interactive Elements:</strong> If there are any interactive experiences, such as displays or hands-on activities, explain how they will enhance the overall event experience. Keep the description clear and focused on what attendees will gain.</p><br/><p><strong>Venue & Atmosphere:</strong> Give a brief mention of the venue and how it contributes to the event’s overall vibe. If the event has a theme like sustainability, mention how it aligns with the venue or event practices. Adding a relevant image can help set the tone.</p><br/><p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to attend, register, or follow for more updates. Reiterate what makes the event special and why it’s a must-attend.</p>`;
    const [eventData, setEventData] = useState({
        cover: [],
        profileImage: null,
        eventName: "New Event",
        eventCategories: [],
        eventOverview: "Add a brief event overview that highlights the key aspects of the event.\n\nMake sure to clearly explain the purpose, what attendees can expect, and why it's valuable to them. Keep it informative, mentioning any special features like workshops, activities, or unique selling points of the products or services offered.\n\nAim to engage the reader by focusing on the most important details, while ensuring the description stays concise and easy to understand.\n\nThis description will be used as an excerpt.",
        eventTitle: defaultTemplate,
        location: {},
        mapInstructions: "",
        eventDate: null,
        selectedDate: [null, null],
        brand: "",
        space: "",
        streetAddress: "Address line will be filled automatically.",
        leaseId: "",
        toSendSpace: ''
    });
    const [bookedRanges, setBookedRanges] = useState([])
    const { data: brandData, isError: isBrandError, isLoading: BrandLoading, isSuccess: isBrandSuccess, error: brandError, isFetching: isBrandFetching } = useGetAllBrandsQuery({}, {
        refetchOnMountOrArgChange: true,
    });

    const { data: spaceData, isError: isSpaceError, isLoading: SpaceLoading, isSuccess: isSpaceSuccess, error: spaceError, isFetching: isSpaceFetching } = useSpacesForEventQuery({ check: true }, {
        refetchOnMountOrArgChange: true,
    });

    const { isError: IsGetCategoryError, isSuccess: GetCategorySuccess, error: GetCategoryError, data: GetCategoryData, isLoading: GetCategoryLoading } = useGetCategoriesQuery('EVENTS')

    useEffect(() => {
        if (GetCategorySuccess) {
            const updatedCategories = GetCategoryData?.data.map((category) => ({
                id: category.id,
                name: category.name,
                selected: false
            }));


            setEventData((prevState) => ({
                ...prevState,
                eventCategories: updatedCategories
            }));
        }
    }, [GetCategorySuccess, GetCategoryData]);

    const navigate = useNavigate();
    const theme = useTheme();
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const [openMapModal, setMapModal] = useState(false);
    const [address, setAddress] = useState("")



    const editorRef = useRef(null);
    const quillRef = useRef(null);

    // console.log(brandData?.data?.groupedBrands)

    const options = [
        ...(brandData?.data?.groupedBrands?.draftBrands || []),
        ...(brandData?.data?.groupedBrands?.publishedBrands || [])
    ].map((brand) => ({
        label: brand.brandName,
        value: brand.id,
        item: brand,
    }));


    const spaceOptions = [
        ...(spaceData?.data?.availableSpaces?.map((space) => {
            const item = {
                location: {
                    lat: space?.brand?.location?.lat,
                    long: space?.brand?.location?.long,
                    additional: space?.brand?.location?.additional,
                    lease: ""
                }
            }
            return {
                label: space.spaceName,
                value: space?.id,
                item: item,
            }
        }) || []),

        ...(spaceData?.data?.tenantSpaces?.map((tenant) => {
            const item = {
                location: {
                    lat: tenant?.space?.brand?.location?.lat,
                    long: tenant?.space?.brand?.location?.long,
                    additional: tenant?.space?.brand?.location?.additional,
                    lease: tenant?.id,
                    tenantSpaceId: tenant?.space?.id
                }
            }
            if (tenant.space) {
                return {
                    label: `${tenant.space.spaceName} (LS)`,
                    value: tenant?.id,
                    item: item,
                };
            }
            return null;
        }) || []),
    ];


    const handleBrandSelect = (value) => {
        const selectedItem = options.find((option) => option.value === value);

        setEventData((prev) => ({
            ...prev,
            brand: selectedItem?.item,
        }));
    };

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

    useEffect(() => {
        if (eventData?.space !== "") {
            let bookedDates = [];


            let selectedSpace = spaceData?.data?.availableSpaces?.find(
                (item) => item?.id === eventData?.space
            );

            if (selectedSpace) {

                if (selectedSpace?.calendarEvents?.length > 0) {
                    bookedDates = selectedSpace.calendarEvents.map((item) => ({
                        start: new Date(item?.start),
                        end: new Date(item?.end),
                    }));
                }
                setBookedRanges(bookedDates);
                return;
            }


            let tenantSpace = spaceData?.data?.tenantSpaces?.find(
                (tenant) => tenant?.id === eventData?.space
            );

            if (tenantSpace) {
                const { leaseInfo } = tenantSpace.contractDetails || {};
                if (leaseInfo?.startDate && leaseInfo?.endDate) {
                    // Convert the dates from "dd.mm.yyyy" format to "yyyy-mm-dd" format
                    const startDate = new Date(leaseInfo.startDate.split('.').reverse().join('-'));
                    const endDate = new Date(leaseInfo.endDate.split('.').reverse().join('-'));

                    // Set the time for startDate to the beginning of the day (00:00:00.000)
                    startDate.setHours(0, 0, 0, 0);

                    // Set the time for endDate to the end of the day (23:59:59.999)
                    endDate.setHours(23, 59, 59, 999);

                    // Get today's date and set the time to the beginning of the day
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Calculate the maximum future date (5 years from today)
                    const maxFutureDate = new Date();
                    maxFutureDate.setFullYear(today.getFullYear() + 5);
                    maxFutureDate.setHours(23, 59, 59, 999);

                    // Block all dates before the start date and after the end date
                    const bookedDates = [
                        { start: new Date(0), end: new Date(startDate.getTime() - 1) }, // Block all dates before startDate
                        { start: new Date(endDate.getTime() + 1), end: maxFutureDate }, // Block all dates after endDate
                    ];

                    // Set the booked date ranges
                    setBookedRanges(bookedDates);
                }
            }


        }
    }, [eventData, eventData?.space, spaceData]);



    // Functions
    const handleMainFileInputClick = () => {
        mainImageRef.current.click();
    };
    const handleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const updatedCover = [...eventData.cover];
            updatedCover[currentIndex] = file;
            setEventData((prev) => ({ ...prev, cover: updatedCover }));
        }
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

    const handleAddImage = () => {
        const nextIndex = eventData.cover.length;
        if (nextIndex < 3) {
            setCurrentIndex(nextIndex);
        }
    };

    const handleRemoveImage = () => {
        const updatedCover = eventData.cover.filter((_, index) => index !== currentIndex);
        setEventData((prev) => ({ ...prev, cover: updatedCover }));
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const CategoryChangeHandler = (index) => {
        const categoriesSelected = eventData?.eventCategories?.filter((cat) => cat.selected).length;

        if (eventData?.eventCategories?.find((cat) => cat.id === index).selected && categoriesSelected === 1) {
            alert("Atleast one category should be selected");
            return;
        }
        if (!eventData?.eventCategories?.find((cat) => cat.id === index).selected && categoriesSelected >= 2) {
            alert("You can select 2 categories at max.");
            return;
        }

        const newCategories = eventData?.eventCategories?.map((cat, i) =>
            cat?.id === index ? { ...cat, selected: !cat.selected } : cat
        )
        setEventData({ ...eventData, eventCategories: newCategories });
    }

    const HandleSlideChange = (index) => {
        if (index >= 0 && index <= eventData.cover.length) {
            setCurrentIndex(index);
        }
    };

    const tabs = [
        { label: "Details", component: <></> },
    ];

    useEffect(() => {
        if (isEditorVisible && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'strike'],
                        [{ 'header': 3 }],
                        [{ 'list': 'ordered' }],
                        [{ 'align': [] }],
                        ['image', 'link'],
                    ],
                },
            });


            quillRef.current.root.innerHTML = eventData.eventTitle || defaultTemplate;

            // Update brandData's brandTitle on text change
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setEventData((prevData) => ({
                    ...prevData,
                    eventTitle: updatedContent,
                }));
            });
        }
    }, [isEditorVisible, eventData?.eventTitle]);

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

    const validateEventData = () => {
        if (!eventData?.cover || eventData?.cover?.length <= 0) {
            toast?.error("Please upload cover photo of brand");
            return false;
        }

        if (!eventData?.profileImage) {
            toast?.error("Please upload profile photo of brand");
            return false;
        }

        if (!eventData?.eventName || eventData?.eventName.trim() === "") {
            toast?.error("Brand name can not be empty.");
            return false;
        }

        const selectedCategories = eventData?.eventCategories?.filter((item) => item?.selected);
        if (!selectedCategories || selectedCategories.length <= 0) {
            toast?.error("Please select at least one category.");
            return false;
        }

        if (!eventData?.eventOverview || eventData?.eventOverview.trim() === "") {
            toast?.error("Brand overview can not be empty.");
            return false;
        }

        if (!eventData?.eventTitle || eventData?.eventTitle.trim() === "") {
            toast?.error("Brand title can not be empty.");
            return false;
        }

        const strippedContent = eventData?.eventTitle?.replace(/<[^>]*>/g, "").trim();
        if (!strippedContent) {
            toast?.error("Brand title can not be empty.");
            return false;
        }

        if (!eventData?.brand || typeof eventData.brand !== "object" || Object.keys(eventData.brand).length === 0) {
            toast?.error("Please select a brand");
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

    const [event, { isSuccess: eventPostSuccess, isError: IsEventPostError, error: eventPostError, data: eventPostData, isLoading: EventPostingLoading }] = useNewEventMutation()

    useEffect(() => {
        if (eventPostSuccess) {
            toast.success(eventPostData?.message)
            navigate("/event")
        }
    }, [eventPostSuccess])

    useEffect(() => {
        if (IsEventPostError) {
            toast.error(eventPostError?.data?.message)
            return
        }
    }, [IsEventPostError])

    const handleSubmit = async (status) => {
        if (!validateEventData()) {
            return;
        }
        setLoadingButton(status);
        try {
            await event({ ...eventData, status });
        } finally {
            setLoadingButton(null);
        }
    };

    const [loadingButton, setLoadingButton] = useState(null);
    const HandlePublishSubmit = () => handleSubmit("PUBLISH");
    const HandleDraftSubmit = () => handleSubmit("DRAFT");
    const HandleArchiveSubmit = () => handleSubmit("ARCHIVE");


    if (isBrandFetching || BrandLoading || GetCategoryLoading || isSpaceFetching || SpaceLoading) {
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
                pb: 2
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
            <FullWidthImgInput
                activity={"event"}
                HandleChange={handleMainImageChange}
                HandleInputCLick={handleMainFileInputClick}
                imageRef={mainImageRef}
                icon={flag}
                editImage={eventData.cover[currentIndex] ? URL.createObjectURL(eventData.cover[currentIndex]) : null}
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
                showDropDown={true}
                options={options}
                onBrandSelect={handleBrandSelect}
                selectedValue={eventData?.brand?.id || ''}
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
                <InputWithMap inputLabel={"Event Overview:"} inputValue={eventData?.eventOverview} setInputValue={(value) => setEventData({ ...eventData, eventOverview: value })} mapDescription={eventData?.streetAddress} activity={"event"} eventName={"Space name"} eventAddress={"Brand name"} defaultDate={eventData.selectedDate || [new Date(), new Date()]} onDateChange={handleDateChange} handleClick={() => setMapModal(true)}
                    options={spaceOptions}
                    selectedValue={eventData?.space || ''}
                    eventData={eventData}
                    updateEventData={updateEventData}
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
            </Box>
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <MapModal activity={"event"} disabled={true} value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[eventData?.location?.lat, eventData?.location?.long]} setBrandData={setEventData} instructionValue={eventData?.mapInstructions}
                    setInstructionValue={(e) => setEventData((prev) => ({
                        ...prev,
                        mapInstructions: e.target.value
                    }))} />
            </ReusableModal>
        </Box >
    )
}

export default NewEvent
