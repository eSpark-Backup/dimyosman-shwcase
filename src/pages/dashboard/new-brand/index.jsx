import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { brandIcon } from '../../../assets'
import ReusableModal from '../../../components/Modal'
import { ChoiceSelectionModal, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom'
import { useGetCategoriesQuery } from '../../../services/categories'
import { useNewBrandMutation } from '../../../services/brands'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'


const NewBrand = () => {
    const defaultTemplate = `<h2><strong>Brand Blog Post Title</strong></h2>
    <p><strong>Product or Service Offerings:</strong> Describe the brand’s main products or services. Focus on what makes these offerings unique, whether it’s quality, design, or innovation. Be sure to explain how these products or services meet customer needs and why they stand out compared to competitors. Including images of products or services can enhance this section.</p>
    </br><p><strong>Customer Experience & Engagement:</strong> If the brand offers personalized customer experiences, loyalty programs, or community engagement initiatives, explain how these efforts benefit customers. Highlight any opportunities for interaction, such as special events, collaborations, or partnerships. Keep the focus on the value added for the brand’s audience.</p>
    </br><p><strong>Brand Presence & Identity:</strong> Briefly describe the brand’s presence in the market, including its history or any notable achievements. Discuss how the brand’s identity aligns with current trends or consumer values, like sustainability or luxury. Including images or visuals that represent the brand’s aesthetics can help set the tone.</p>
    </br><p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to explore the brand’s offerings, visit the website, or follow on social media for updates. Reiterate what makes the brand special and why it should be a go-to choice for consumers.</p>`;

    const [brandData, setBrandData] = useState({
        cover: [],
        profileImage: null,
        brandName: "NEW BRAND",
        brandCategories: [],
        brandOverview: "Add a brief brand overview that highlights the core aspects of the brand.\n\nClearly explain the brand’s mission, what makes it unique, and why it stands out in the market. Mention key products or services, emphasizing any unique selling points or values the brand embodies (e.g., sustainability, luxury, innovation).\n \nKeep it concise and informative, focusing on the brand’s identity and what customers can expect. \n\nThis description will be used as an excerpt.",
        brandTitle: defaultTemplate,
        location: { lat: 30.188760426055236, long: 70.22460937500001 },
        mapInstructions: "",
        streetAddress: "123 Williamsburg Ave, Brooklyn, NY 11211"
    });

    const { isError, isSuccess, error, data, isLoading } = useGetCategoriesQuery('BRANDS')
    const [brand, { isSuccess: brandPostSuccess, isError: IsBrandPostError, error: brandPostError, data: brandPostData, isLoading: BrandPostingLoading }] = useNewBrandMutation()

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


            setBrandData((prevState) => ({
                ...prevState,
                brandCategories: updatedCategories
            }));
        }
    }, [isSuccess, data]);

    const validateBrandData = () => {
        if (!brandData?.cover || brandData?.cover?.length <= 0) {
            toast?.error("Please upload cover photo of brand");
            return false;
        }

        if (!brandData?.profileImage) {
            toast?.error("Please upload profile photo of brand");
            return false;
        }

        if (!brandData?.brandName || brandData?.brandName.trim() === "") {
            toast?.error("Brand name can not be empty.");
            return false;
        }

        const selectedCategories = brandData?.brandCategories?.filter((item) => item?.selected);
        if (!selectedCategories || selectedCategories.length <= 0) {
            toast?.error("Please select at least one category.");
            return false;
        }

        if (!brandData?.brandOverview || brandData?.brandOverview.trim() === "") {
            toast?.error("Brand overview can not be empty.");
            return false;
        }

        if (!brandData?.brandTitle || brandData?.brandTitle.trim() === "") {
            toast?.error("Brand title can not be empty.");
            return false;
        }

        if (!brandData?.mapInstructions || brandData?.mapInstructions.trim() === "") {
            toast?.error("Map additional field is required");
            return false;
        }

        const strippedContent = brandData?.brandTitle?.replace(/<[^>]*>/g, "").trim();
        if (!strippedContent) {
            toast?.error("Brand title can not be empty.");
            return false;
        }

        return true;
    };

    const [loadingButton, setLoadingButton] = useState(null);

    const handleSubmit = async (status) => {
        if (!validateBrandData()) {
            return;
        }
        setLoadingButton(status);
        try {
            await brand({ ...brandData, status });
        } finally {
            setLoadingButton(null);
        }
    };


    const HandlePublishSubmit = () => handleSubmit("PUBLISH");
    const HandleDraftSubmit = () => handleSubmit("DRAFT");
    const HandleArchiveSubmit = () => handleSubmit("ARCHIVE");


    useEffect(() => {
        if (brandPostSuccess) {
            console.log(brandPostData)
            toast.success(brandPostData?.message)
            navigate("/brand")
        }
    }, [brandPostSuccess])


    useEffect(() => {
        if (IsBrandPostError) {
            toast.error(brandPostError?.data?.message)
            return
        }
    }, [IsBrandPostError])



    const navigate = useNavigate();
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const profileImageRef = useRef(null)
    const mainImageRef = useRef(null)
    const [address, setAddress] = useState("")

    const handleMainFileInputClick = () => {
        mainImageRef.current.click();
    };

    const handleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const updatedCover = [...brandData.cover];
            updatedCover[currentIndex] = file;
            setBrandData((prev) => ({ ...prev, cover: updatedCover }));
        }
    };


    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    };


    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setBrandData((prev) => ({
                ...prev,
                profileImage: file,
            }));
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


    const [modalOpen, setModalOpen] = useState(false);
    const [openMapModal, setMapModal] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const selectedCategories = brandData.brandCategories.filter(cat => cat.selected);




    const [isEditorVisible, setIsEditorVisible] = useState(false);
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
                        [{ 'header': 3 }],
                        [{ 'list': 'ordered' }],
                        [{ 'align': [] }],
                        ['image', 'link'],
                    ],
                },
            });


            quillRef.current.root.innerHTML = brandData.brandTitle || defaultTemplate;

            // Update brandData's brandTitle on text change
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setBrandData((prevData) => ({
                    ...prevData,
                    brandTitle: updatedContent,
                }));
            });
        }
    }, [isEditorVisible, brandData.brandTitle]);


    const tabs = [
        { label: "Details", component: <></> },
    ];

    const CategoryChangeHandler = (index) => {
        const categoriesSelected = brandData.brandCategories.filter((cat) => cat.selected).length;

        if (brandData.brandCategories.find((cat) => cat.id === index).selected && categoriesSelected === 1) {
            alert("Atleast one category should be selected");
            return;
        }
        if (!brandData.brandCategories.find((cat) => cat.id === index).selected && categoriesSelected >= 2) {
            alert("You can select 2 categories at max.");
            return;
        }

        const newCategories = brandData.brandCategories.map((cat, i) =>
            cat?.id === index ? { ...cat, selected: !cat.selected } : cat
        )
        setBrandData({ ...brandData, brandCategories: newCategories });
    }

    const HandleSlideChange = (index) => {
        if (index >= 0 && index <= brandData.cover.length) {
            setCurrentIndex(index);
        }
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
                HandleChange={handleMainImageChange}
                HandleInputCLick={handleMainFileInputClick}
                imageRef={mainImageRef}
                icon={brandIcon}
                activity="brand"
                editImage={brandData.cover[currentIndex] ? URL.createObjectURL(brandData.cover[currentIndex]) : null}
                handleAdd={handleAddImage}
                handleRemove={handleRemoveImage}
                currentIndex={currentIndex}
                HandleSlideChange={HandleSlideChange}
            />

            <ImgInputWithCategories
                handleImgClick={HandleProfileFileInputClick}
                imgRef={profileImageRef}
                handleChange={HandleProfileImageChange}
                inputVal={brandData.brandName}
                onChange={(e) =>
                    setBrandData((prev) => ({ ...prev, brandName: e.target.value }))
                }
                inputlabel={"brand name:"}
                categoryLabel={"brand category:"}
                categories={selectedCategories}
                handleModalOpen={handleModalOpen}
                description={
                    "1 min - 5 max. Checkbox on the categories will display them publicly. All added Brand categories are inherited by Events and Spaces, allowing them for individual selection."
                }
                activity={"brand"}
                HandleCategoryChange={CategoryChangeHandler}
            />
            <ReusableModal open={modalOpen} handleClose={handleModalClose} heading={"Select Brand Categories"}>
                <ChoiceSelectionModal
                    categories={brandData.brandCategories}
                    handleClose={handleModalClose}
                    onSelect={(categories) => setBrandData({ ...brandData, brandCategories: categories })}
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
                <InputWithMap mapDescription={brandData?.streetAddress} inputLabel={"Brand Overview:"} inputValue={brandData.brandOverview} setInputValue={(value) => setBrandData({ ...brandData, brandOverview: value })} handleClick={() => setMapModal(true)} activity={"brand"} />
                <Box sx={{ width: "98%" }}>
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
                                dangerouslySetInnerHTML={{ __html: brandData.brandTitle }} // Access from brandData
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
                <MapModal activity={"brand"} value={address} setValue={setAddress} addressLine={"Selected Address:"} address={brandData?.streetAddress} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[brandData?.location?.lat, brandData?.location?.long]} setBrandData={setBrandData} instructionValue={brandData?.mapInstructions}
                    setInstructionValue={(e) => setBrandData((prev) => ({
                        ...prev,
                        mapInstructions: e.target.value
                    }))} />
            </ReusableModal>
        </Box>
    )
}

export default NewBrand
