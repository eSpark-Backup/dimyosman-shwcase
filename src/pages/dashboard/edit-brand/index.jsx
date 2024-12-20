import { Box, Button, CircularProgress, Stack, Typography, useTheme, LinearProgress } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { addGrey, brand, brandIcon, brandMain } from '../../../assets'
import ReusableModal from '../../../components/Modal'
import { ChoiceSelectionModal, EventCard, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetCategoriesQuery } from '../../../services/categories'
import { useEditBrandMutation, useGetAllBrandsQuery } from '../../../services/brands'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import { profileContent } from '../../../constant'

const EditBrand = () => {
  const navigate = useNavigate();
  const { events } = useSelector(state => state.event)
  const myEvents = events.filter((event) => event.owned);
  const theme = useTheme()
  const mainImageRef = useRef(null)
  const profileImageRef = useRef(null)
  const [address, setAddress] = useState("");

  const [brandData, setBrandData] = useState({
    cover: [],
    brandName: "",
    brandOverview: "",
    profileImage: null,
    brandTitle: null,
    brandCategories: [],
    location: {},
    mapInstructions: ""
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = useParams();

  const { isError: IsGetCategoryError, isSuccess: GetCategorySuccess, error: GetCategoryError, data: GetCategoryData, isLoading: GetCategoryLoading } = useGetCategoriesQuery('BRANDS')
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllBrandsQuery({
    page: 1, pageSize: 7, id: params?.brandId
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

  useEffect(() => {
    if (GetCategorySuccess && isSuccess) {
      const allCategories = GetCategoryData?.data?.map((cat, index) => ({
        id: index,
        name: cat?.name,
        selected: false,
      }));

      const selectedCategories = data?.data?.brandCategory?.map((cat) => cat?.name);

      const mergedCategories = allCategories.map((category) => ({
        ...category,
        selected: selectedCategories?.includes(category.name),
      }));

      setBrandData((prevState) => ({
        ...prevState,
        brandCategories: mergedCategories,
      }));
      setBrandData((prevState) => ({
        ...prevState,
        brandCategories: mergedCategories,
        brandName: data?.data?.brandName,
        profileImage: data?.data?.brandImage,
        brandOverview: data?.data?.details?.description,
        brandTitle: data?.data?.details?.htmlContent,
        location: data?.data?.location,
        cover: data?.data?.coverImages,
        mapInstructions: data?.data?.location?.additional
      }));
    }
  }, [GetCategorySuccess, isSuccess, data]);


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

  const handleAddImage = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < brandData.cover.length + 1 && nextIndex <= 2) {
      setCurrentIndex(nextIndex);
    }
  };


  const handleRemoveImage = () => {
    const updatedCover = brandData.cover.filter((_, index) => index !== currentIndex);
    setBrandData((prev) => ({ ...prev, cover: updatedCover }));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const HandleProfileFileInputClick = () => {
    profileImageRef.current.click();
  }

  const HandleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setBrandData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [openMapModal, setMapModal] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const selectedCategories = brandData?.brandCategories?.filter(cat => cat.selected);


  const [selectedChoice, setSelectedChoice] = useState(0)
  const [activeTab, setActiveTab] = useState("Details");

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);


  useEffect(() => {
    if (quillRef.current) {
      quillRef.current = null;
    }
    setBrandData((prevState) => ({
      ...prevState,
      brandTitle: prevState?.brandTitle,
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
      quillRef.current.root.innerHTML = brandData?.brandTitle;
      quillRef.current.on('text-change', () => {
        const updatedContent = quillRef.current.root.innerHTML;
        setBrandData((prevData) => ({
          ...prevData,
          brandTitle: updatedContent,
        }));
      });
    }
  }, [isEditorVisible, brandData?.brandTitle]);


  const tabs = [
    { label: "Details", component: <></> },
    { label: "Events", component: <></> },
  ];
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Editor') {
      setIsEditorVisible(true);
    }
  };

  const CategoryChangeHandler = (index) => {
    const categoriesSelected = brandData?.brandCategories.filter((cat) => cat.selected).length;

    if (brandData?.brandCategories?.find((cat) => cat.id === index)?.selected && categoriesSelected === 1) {
      alert("Atleast one category should be selected");
      return;
    }
    if (!brandData?.brandCategories?.find((cat) => cat.id === index)?.selected && categoriesSelected >= 2) {
      alert("You can select 2 categories at max.");
      return;
    }

    const newCategories = brandData?.brandCategories?.map((cat, i) =>
      cat?.id === index ? { ...cat, selected: !cat.selected } : cat
    )
    setBrandData({ ...brandData, brandCategories: newCategories });
  }
  const [brand, { isSuccess: brandPostSuccess, isError: IsBrandPostError, error: brandPostError, data: brandPostData }] = useEditBrandMutation()

  useEffect(() => {
    if (brandPostSuccess) {
      toast.success(brandPostData?.message)
      navigate("/brand")
    }
  }, [brandPostSuccess])

  useEffect(() => {
    if (IsBrandPostError) {
      toast.error(brandPostError?.data?.message)
    }
  }, [IsBrandPostError])

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
      await brand({ brandData: { ...brandData, status }, id: params?.brandId });
    } finally {
      setLoadingButton(null);
    }
  };

  const HandlePublishSubmit = () => handleSubmit("PUBLISH");
  const HandleDraftSubmit = () => handleSubmit("DRAFT");
  const HandleArchiveSubmit = () => handleSubmit("ARCHIVE");

  const HandleSlideChange = (index) => {
    if (index >= 0 && index <= brandData.cover.length) {
      setCurrentIndex(index);
    }
  };

  if (isLoading || GetCategoryLoading || isFetching) {
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
        position: "relative",
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
          zIndex: 99,
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
          loadingIndicator={
            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
          }
          onClick={HandleDraftSubmit}
          loading={loadingButton === "Draft"}
          disabled={loadingButton && loadingButton !== "Draft"}
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
          loadingIndicator={
            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
          }
          loading={loadingButton === "PUBLISH"}
          onClick={HandlePublishSubmit}
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
          loadingIndicator={
            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
          }
          onClick={HandleArchiveSubmit}
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
        editImage={
          brandData.cover[currentIndex]?.url
            ?
            brandData.cover[currentIndex]?.url
            :
            brandData.cover[currentIndex] ?
              URL.createObjectURL(brandData.cover[currentIndex])
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
        inputVal={brandData?.brandName}
        onChange={(e) => setBrandData((prev) => ({
          ...prev,
          brandName: e.target.value
        }))}
        inputlabel={"brand name:"}
        categoryLabel={"brand category:"}
        categories={selectedCategories}
        handleModalOpen={handleModalOpen}
        description={"Checkbox on the categories will display them publicly. All selected Brand categories are inherited by Events and Spaces, allowing them for individual selection."}
        activity={"brand"}
        HandleCategoryChange={CategoryChangeHandler}
        imgUrl={brandData?.profileImage}
      />
      <ReusableModal cat open={modalOpen} handleClose={handleModalClose} heading={"Select Brand Categories"}>
        <ChoiceSelectionModal
          categories={brandData?.brandCategories}
          handleClose={handleModalClose}
          onSelect={(categories) => setBrandData({ ...brandData, brandCategories: categories })}
        />
      </ReusableModal>
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
          activeTab?.label === "Events"
            ?
            <Box
              sx={{
                width: "98%",
                display: "flex",
                flexDirection: "column",
                rowGap: "20px"
              }}
            >
              <Box
                sx={{
                  width: "95%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: "10px"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "16px",
                    flexDirection: { xs: "column", sm: "row" },
                    rowGap: "2px"
                  }}
                >
                  <Typography fontSize={16} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "400" }}>Show:</Typography>
                  <Typography onClick={() => setSelectedChoice(0)} fontSize={16} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 0 ? "600" : "400", cursor: "pointer" }}>All</Typography>
                  <Typography onClick={() => setSelectedChoice(1)} fontSize={16} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 1 ? "600" : "400", cursor: "pointer" }}>Upcoming</Typography>
                  <Typography onClick={() => setSelectedChoice(2)} fontSize={16} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 2 ? "600" : "400", cursor: "pointer" }}>Past</Typography>
                </Box>
                <Button
                  onClick={() => navigate("/new-event")}
                  sx={{
                    backgroundColor: "rgb(209, 219, 215, 0.4)",
                    height: "31px",
                    width: "142px",
                    color: theme.palette.primary.main,
                    fontWeight: "600",
                    fontSize: "16px",
                    display: "flex",
                    columnGap: "6px",
                    alignItems: "center",
                    ":hover": {
                      backgroundColor: "rgb(209, 219, 215, 0.4)",
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <img src={addGrey} alt="" />
                  Add New
                </Button>

              </Box>
              <Stack
                marginTop={2}
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                rowGap={4}
                columnGap={0}
              >
                {profileContent[0].eventSection.map((event, ind) => {
                  return (
                    <Box
                      key={`event-${ind + 1}`}
                      sx={{
                        width: { xs: "100%", md: "328px" }
                      }}
                    >
                      <EventCard edit event={event} key={ind} showBtn={true} />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
            :
            <>
              <InputWithMap inputLabel={"Brand Overview:"} inputValue={brandData?.brandOverview} setInputValue={(value) => setBrandData({ ...brandData, brandOverview: value })} handleClick={() => setMapModal(true)} mapDescription={"Click on the map to select Address."} activity={"brand"} />
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
                      minHeight: "60px",
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
                      dangerouslySetInnerHTML={{ __html: brandData?.brandTitle }}
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
        }
      </Box>
      <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
        <MapModal value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[brandData?.location?.lat, brandData?.location?.long]} setBrandData={setBrandData} instructionValue={brandData?.mapInstructions}
          setInstructionValue={(e) => setBrandData((prev) => ({
            ...prev,
            mapInstructions: e.target.value
          }))} />
      </ReusableModal>
    </Box>
  )
}

export default EditBrand
