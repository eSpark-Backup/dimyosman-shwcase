import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { addGrey, brandIcon } from '../../../assets'
import ReusableModal from '../../../components/Modal'
import { ChoiceSelectionModal, EventCard, FullWidthImgInput, ImgInputWithCategories, InputWithMap, MapModal, OutlinedTabs } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { events } from '../../../constant'

const EditBrand = () => {
  const theme = useTheme()
  const mainImageRef = useRef(null)
  const profileImageRef = useRef(null)
  const [brandName, setBrandName] = useState("EcoLux Designs")
  const [brandOverview, setBrandOverview] = useState("EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials.")
  const [address, setAddress] = useState("");

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


  const [selectedChoice, setSelectedChoice] = useState(0)
  const [activeTab, setActiveTab] = useState("Details");

  const defaultTemplate = `<h2><strong>EcoLux Designs: Where Luxury Meets Sustainability</strong></h2><p>In an industry where trends come and go, EcoLux Designs stands out by creating fashion with a purpose. As a trailblazer in the world of sustainable luxury, this brand is redefining high-end fashion by merging style with eco-friendly practices. Every piece in the EcoLux collection is crafted with the utmost care, using organic fabrics, recycled materials, and responsible manufacturing processes.</p><img src="" alt="EcoLux Designs Image" style="width:100%; height:auto; margin: 10px 0;"/><p>From elegant dresses to timeless accessories, EcoLux Designs offers a wide range of high-end fashion pieces that not only look good but also do good for the planet. The brand’s commitment to sustainability goes beyond just the materials—they focus on ethical production and long-lasting designs, ensuring that each item has minimal environmental impact and maximum longevity in your wardrobe.</p><br/><h2>Leading the Movement Toward Eco-Conscious Fashion</h2><p>What makes EcoLux Designs truly special is the balance it strikes between luxury and sustainability. The designs are contemporary, chic, and versatile, proving that eco-conscious fashion doesn’t have to compromise on style. Whether you’re attending a gala or simply updating your everyday wardrobe, EcoLux Designs has something that will elevate your look while aligning with your values.</p><br/><p>As more consumers seek out brands that reflect their commitment to the environment, EcoLux Designs is at the forefront of this movement—proving that fashion can be both luxurious and sustainable. By investing in quality over quantity, this brand is making a statement that fashion should enhance the world, not harm it.</p>`;

  const [brandTitle, setBrandTitle] = useState(defaultTemplate);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);


  useEffect(() => {

    if (quillRef.current) {
      quillRef.current = null;
    }
    setBrandTitle(defaultTemplate);
    setIsEditorVisible(false);
  }, [activeTab]);

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


      quillRef.current.root.innerHTML = brandTitle;


      quillRef.current.on('text-change', () => {
        const updatedContent = quillRef.current.root.innerHTML;
        setBrandTitle(updatedContent);
      });
    }
  }, [isEditorVisible, brandTitle]);


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
        description={"1 min - 2 max. Checkbox on the categories will display them publicly."}
      />
      <ReusableModal open={modalOpen} handleClose={handleModalClose} heading={"Select Brand Categories"}>
        <ChoiceSelectionModal
          categories={categories}
          handleClose={handleModalClose}
          onSelect={setCategories}
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
                  <Typography variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "400" }}>Show:</Typography>
                  <Typography onClick={() => setSelectedChoice(0)} variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 0 ? "600" : "400", cursor: "pointer" }}>All</Typography>
                  <Typography onClick={() => setSelectedChoice(1)} variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 1 ? "600" : "400", cursor: "pointer" }}>Upcoming</Typography>
                  <Typography onClick={() => setSelectedChoice(2)} variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 2 ? "600" : "400", cursor: "pointer" }}>Past</Typography>
                </Box>
                <Button
                  sx={{
                    backgroundColor: "rgb(209, 219, 215, 0.4)",
                    height: "31px",
                    width: "142px",
                    color: theme.palette.primary.main,
                    fontWeight: "600",
                    fontSize: "16px",
                    display: "flex",
                    columnGap: "6px",
                    alignItems: "center"
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
                {events.map((event, ind) => {
                  return (
                    <Box
                      sx={{
                        width: { xs: "100%", md: "328px" }
                      }}
                    >
                      <EventCard event={event} key={ind} showBtn={true} />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
            :
            <>
              <InputWithMap inputLabel={"Brand Overview:"} inputValue={brandOverview} setInputValue={setBrandOverview} handleClick={() => setMapModal(true)} mapDescription={"Click on the map to select Address."} />
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
                    <Typography variant="body1" color={theme.palette.primary.main}>
                      {brandTitle.replace(/<[^>]*>/g, '')}
                    </Typography>
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
        <MapModal value={address} setValue={setAddress} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} />
      </ReusableModal>
    </Box>
  )
}

export default EditBrand
