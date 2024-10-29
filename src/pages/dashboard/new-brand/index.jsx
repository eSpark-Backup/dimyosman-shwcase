import { Box, Button, Checkbox, IconButton, InputAdornment, Modal, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { activeItemIcon, add, addIcon, brandIcon, locationIcon, miniMap, modalMap, notActiveIcon, subtract, uploadIcon } from '../../../assets'
import Input from '../../../components/input'
import ReusableModal from '../../../components/Modal'
import SearchBar from '../../../components/SearchBar'
import { CheckBox } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';


const NewBrand = () => {
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [brandName, setBrandName] = useState("NEW BRAND")
    const [brandOverview, setBrandOverview] = useState("Add a brief brand overview that highlights the core aspects of the brand.\n\nClearly explain the brand’s mission, what makes it unique, and why it stands out in the market. Mention key products or services, emphasizing any unique selling points or values the brand embodies (e.g., sustainability, luxury, innovation).\n \nKeep it concise and informative, focusing on the brand’s identity and what customers can expect. \n\nThis description will be used as an excerpt.")

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

    const [searchValue, setSearchValue] = useState("")

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


    const [selectedInModal, setSelectedInModal] = useState(categories);
    const [modalOpen, setModalOpen] = useState(false);
    const [openMapModal, setMapModal] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
        setSelectedInModal(categories.map(cat => ({ ...cat })));
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleSelectButtonClick = () => {
        const categoriesSelected = selectedInModal.filter((cat) => cat.selected);
        if (categoriesSelected.length === 0) {
            alert("You have to select at least one category");
            return;
        }

        else if (categoriesSelected.length > 5) {
            alert("You can select at most 5 categories");
            return;
        }
        setCategories(selectedInModal);
        handleModalClose();
    };


    const handleCheckboxChangeInModal = (index) => {
        const updatedSelection = selectedInModal.map((cat, i) =>
            i === index ? { ...cat, selected: !cat.selected } : cat
        );
        setSelectedInModal(updatedSelection);
    };

    const selectedCategories = categories.filter(cat => cat.selected);
    const [brandTitle, setBrandTitle] = useState("New Brand");
    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (isEditorVisible && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video', 'formula'],

                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],

                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],

                        ['clean']
                    ],
                },
            });

            // Set initial content of the editor
            quillRef.current.root.innerHTML = brandTitle;

            // Update the state with Quill's content when it changes
            quillRef.current.on('text-change', () => {
                setBrandTitle(quillRef.current.root.innerHTML);
            });
        }
    }, [isEditorVisible]);
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
                    height: "300px",
                    border: "1px dashed rgb(0, 20, 28, 0.4)",
                    backgroundColor: "rgb(209, 219, 215, 0.2)",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Box
                    sx={{
                        background: "rgb(196, 119, 127, 0.2)",
                        width: "48px",
                        height: "48px",
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <img src={brandIcon} alt="Icon" style={{ width: "23px", height: "32px" }} />
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        top: { xs: "10px", md: "10px" },
                        right: "10px",
                        display: "flex",
                        columnGap: "25px",
                        // flexWrap: "wrap",
                        rowGap: "10px",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "flex-end",
                        alignItems: "flex-end"
                    }}
                >
                    <Button
                        sx={{
                            fontSize: "16px",
                            width: "143px",
                            height: "31px"
                        }}
                    >
                        Save as Draft

                    </Button>
                    <Button
                        sx={{
                            fontSize: "16px",
                            width: "103px",
                            height: "31px",
                            backgroundColor: "rgb(0, 20, 28, 0.9)"
                        }}
                    >
                        Publish

                    </Button>
                    <Button
                        sx={{
                            fontSize: "16px",
                            width: "102px",
                            height: "31px"
                        }}
                    >
                        Archive

                    </Button>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        display: "flex",
                        columnGap: "20px"
                    }}
                >
                    <img src={activeItemIcon} alt="Icon" style={{ cursor: "pointer" }} />
                    <img src={notActiveIcon} alt="Icon" style={{ cursor: "pointer" }} />
                    <img src={notActiveIcon} alt="Icon" style={{ cursor: "pointer" }} />
                    <img src={add} alt="Icon" style={{ cursor: "pointer" }} />
                    <img src={subtract} alt="Icon" style={{ cursor: "pointer" }} />

                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0px",
                        cursor: "pointer"
                    }}
                    onClick={HandleMainFileInputClick}
                >
                    <Typography
                        sx={{
                            fontSize: '14px',
                            fontWeight: "300",
                            color: "#00141C",
                            fontStyle: "italic"
                        }}
                    >
                        upload image:
                    </Typography>
                    <img src={uploadIcon} alt="Icon" />
                    <input type="file" style={{ display: "none" }} ref={mainImageRef} onChange={HandleMainImageChange} />
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    // px: "10px",

                }}
            >
                <Box
                    sx={{
                        width: "98%",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        columnGap: "30px"
                    }}
                >
                    <Box
                        sx={{
                            height: "96px",
                            width: "96px",
                            border: "1px dashed rgb(0, 20, 28, 0.4)",
                            backgroundColor: "rgb(209, 219, 215, 0.2)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            pt: "15px"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: "0px",
                                cursor: "pointer"
                            }}
                            onClick={HandleProfileFileInputClick}
                        >
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: "300",
                                    color: "#00141C",
                                    fontStyle: "italic"
                                }}
                            >
                                upload image:
                            </Typography>
                            <img src={uploadIcon} alt="Icon" />
                            <input type="file" style={{ display: "none" }} ref={profileImageRef} onChange={HandleProfileImageChange} />
                        </Box>

                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "90%" },
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "10px",
                        }}
                    >
                        <Input label={"brand name:"} type={"text"} value={brandName} onInputChange={(e) => setBrandName(e.target.value)} sx={{ fontSize: "32px", fontWeight: "600", height: "54px" }} />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: "8px"
                            }}
                        >
                            <Typography
                                sx={{ fontStyle: "italic", textAlign: "left", fontWeight: 300, color: "#00141C" }}
                                variant="h6"
                            >
                                brand category:
                            </Typography>
                            <Box
                                sx={{
                                    height: "112px",
                                    border: "1px dashed rgb(0, 20, 28, 0.4)",
                                    backgroundColor: "rgb(209, 219, 215, 0.2)",
                                    position: "relative",
                                    p: "10px 15px",
                                    overflowY: "auto"
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "95%",
                                        display: "flex",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {selectedCategories.length > 0 ? (
                                        selectedCategories.map((cat) => (
                                            <Box key={cat.name} display="flex" alignItems="center" marginRight={2} columnGap={0}>
                                                <Checkbox checked={cat.selected} readOnly />
                                                <Typography sx={{ fontSize: "20px", fontWeight: "300", color: "#00141C" }}>{cat.name}</Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography>No categories selected.</Typography>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        display: "flex",
                                        columnGap: "10px"
                                    }}
                                >
                                    <img src={add} alt="Add Icon" style={{ cursor: "pointer" }} onClick={handleModalOpen} />
                                    <img src={subtract} alt="Subtract Icon" style={{ cursor: "pointer" }} onClick={handleModalOpen} />
                                </Box>
                            </Box>
                            <Typography sx={{ fontSize: "14px", color: "#00141C", fontStyle: "italic" }}>1 min - 5 max. Checkbox on the categories will display them publicly. All added Brand categories are inherited by Events and Spaces, allowing them for individual selection.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ReusableModal open={modalOpen} handleClose={handleModalClose} heading={"Select Brand Categories"}>
                <SearchBar placeholder={"Search..."} value={searchValue} onInputChange={(e) => setSearchValue(e.target.value)} />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "16px",
                        padding: "16px",
                        border: "1px solid rgba(209, 219, 215, 0.5)",
                        borderRadius: "5px",
                        maxHeight: "345px",
                        overflowY: "auto"
                    }}
                >
                    {
                        (
                            searchValue !== ""
                                ?
                                selectedInModal.filter((cat) => cat.name.toLowerCase().includes(searchValue.toLowerCase()))
                                :
                                selectedInModal
                        )
                            .map((cat, index) => (
                                <Box key={cat.name} display="flex" alignItems="center" marginBottom={1}>
                                    <Checkbox
                                        checked={cat.selected}
                                        onChange={() => handleCheckboxChangeInModal(index)}
                                    />
                                    <Typography>{cat.name}</Typography>
                                </Box>
                            ))

                    }
                </Box>
                <Typography sx={{ fontSize: "14px", color: "#00141C", fontStyle: "italic" }}>
                    1min - 5max.
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#00141C", fontStyle: "italic" }}>
                    Selected Brand categories are inherited by Events and Spaces, allowing them for individual selection.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        sx={{
                            height: "31px",
                            width: "92px",
                            background: "rgba(209, 219, 215, 0.4)",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#00141C",
                            "&:hover": {
                                backgroundColor: "rgba(209, 219, 215, 0.4)"
                            }
                        }}
                        onClick={handleSelectButtonClick}
                    >
                        Select
                    </Button>
                </Box>
            </ReusableModal>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    rowGap: "32px"
                }}
            >
                <Box
                    sx={{
                        width: "98%",
                        display: "flex",
                        justifyContent: "space-between",
                        rowGap: "10px",
                        flexDirection: { xs: "column", md: "row" }
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: "100%", md: "65%" }
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: "3px"
                            }}

                        >
                            <Typography variant='h3' sx={{ textAlign: "left", color: "#00141C", fontWeight: "600" }}>Brand Overview:</Typography>
                            <Input value={brandOverview} onInputChange={(e) => setBrandOverview(e.target.value)} multiline={true} sx={{ height: "auto", fontWeight: "400", py: "10px", px: "10px" }} />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "25%" },
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "10px"
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: "left"
                            }}
                            variant='h6'
                        >
                            Headqarters at:
                        </Typography>
                        <img src={miniMap} alt="Map" onClick={() => setMapModal(true)} style={{ cursor: "pointer" }} />
                        <Typography
                            sx={{
                                textAlign: "left"
                            }}
                            variant='h6'
                        >
                            Select location
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: "98%",
                    }}
                >
                    {
                        !isEditorVisible
                        &&
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
                            <Typography variant="body1" color="textSecondary">
                                {brandTitle.replace(/<[^>]*>/g, '') || "Click to edit..."}
                            </Typography>
                        </Box>
                    }

                    {
                        isEditorVisible &&
                        <Box
                            ref={editorRef}
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                left: '0px',
                                border: "1px dashed rgb(0, 20, 28, 0.2)",
                                borderRadius: "3px",
                                p: "10px",
                                backgroundColor: "rgb(209, 219, 215, 0.2)",
                                cursor: "text"
                            }}
                            tabIndex={0}
                        >
                            <Typography variant="body2" color="textSecondary">
                                Editor content here...
                            </Typography>
                        </Box>
                    }

                </Box>
            </Box>
            <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
                <Input type={"text"} placeholder={"Type Address..."} endAdornment={<InputAdornment position="end">
                    <IconButton>
                        <img src={locationIcon} alt="" />
                    </IconButton>
                </InputAdornment>} />
                <img src={modalMap} alt='Modal Map' />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "3px"
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            textAlign: "left",
                            color: "#00141C",
                            fontWeight: "600"
                        }}
                    >
                        <span style={{ fontWeight: "300" }}>Selected Address: </span>
                        123 Williamsburg Ave, Brooklyn, NY 11211
                    </Typography>
                    <Input type={"text"} placeholder={"Additional instructions like entrances, flores..."} />

                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        sx={{
                            height: "31px",
                            width: "92px",
                            background: "rgba(209, 219, 215, 0.4)",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#00141C",
                            "&:hover": {
                                backgroundColor: "rgba(209, 219, 215, 0.4)"
                            }
                        }}
                        onClick={handleSelectButtonClick}
                    >
                        Select
                    </Button>
                </Box>
            </ReusableModal>
        </Box>
    )
}

export default NewBrand
