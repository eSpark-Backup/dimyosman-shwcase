import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { flag } from '../../../assets'
import { FullWidthImgInput, ImgInputWithCategories, InputWithMap, OutlinedTabs } from '../../../components'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { useTheme } from '@emotion/react'
import { useNavigate } from 'react-router-dom'

const NewEvent = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // States and Ref
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [eventName, setEventName] = useState("New Event")
    const [categories, setCategories] = useState([
        { name: 'Sustainable Fashion', selected: true, id: 1 },
        { name: 'Real Estate', selected: false, id: 2 },
        { name: 'Technology', selected: false, id: 3 },
        { name: 'Health & Wellness', selected: false, id: 4 },
        { name: 'Education', selected: false, id: 5 },
    ]);
    const [eventOverview, setEventOverview] = useState("Add a brief event overview that highlights the key aspects of the event.\n\nMake sure to clearly explain the purpose, what attendees can expect, and why it's valuable to them. Keep it informative, mentioning any special features like workshops, activities, or unique selling points of the products or services offered.\n\nAim to engage the reader by focusing on the most important details, while ensuring the description stays concise and easy to understand.\n\nThis description will be used as an excerpt.")
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    const defaultTemplate = `<h2><strong>Event Blog Post Title</strong></h2><p><strong>Main Features:</strong> Highlight the key aspects of the event. This could include exclusive offers, workshops, activities, or special guests. Be sure to describe what attendees can expect and why it’s valuable to them. Adding images to this section can make it more visually appealing.</p><br/><p><strong>Interactive Elements:</strong> If there are any interactive experiences, such as displays or hands-on activities, explain how they will enhance the overall event experience. Keep the description clear and focused on what attendees will gain.</p><br/><p><strong>Venue & Atmosphere:</strong> Give a brief mention of the venue and how it contributes to the event’s overall vibe. If the event has a theme like sustainability, mention how it aligns with the venue or event practices. Adding a relevant image can help set the tone.</p><br/><p><strong>Conclusion:</strong> Wrap up with a call to action, encouraging readers to attend, register, or follow for more updates. Reiterate what makes the event special and why it’s a must-attend.</p>`;
    const [eventTitle, setEventTitle] = useState(defaultTemplate);

    const editorRef = useRef(null);
    const quillRef = useRef(null);





    // Functions
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
            quillRef.current.root.innerHTML = eventTitle || defaultTemplate;
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setEventTitle(updatedContent);
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
                    zIndex: 2,
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
                  onClick={() => navigate(`/event`)}
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
                  onClick={() => navigate(`/event`)}
                >
                  Archive
                </Button>
            </Box>
            <FullWidthImgInput activity={"event"} HandleChange={HandleMainImageChange} HandleInputCLick={HandleMainFileInputClick} imageRef={mainImageRef} icon={flag} />

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
                showDropDown={true}
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
                <InputWithMap inputLabel={"Event Overview:"} inputValue={eventOverview} setInputValue={setEventOverview} mapDescription={"Address line will be filled automatically."} activity={"event"} eventName={"Space name"} eventAddress={"Brand name"} defaultDate={"dd.mm.yyyy"} />
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
            </Box>

        </Box >
    )
}

export default NewEvent
