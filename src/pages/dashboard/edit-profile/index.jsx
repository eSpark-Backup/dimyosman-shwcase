import { Box, LinearProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { OutlinedTabs, ProfileCard } from "../../../components";
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { brandMain } from '../../../assets';
import { useGetUserProfileQuery, useUserProfileUpdateMutation } from '../../../services/user';
import { updateUser } from "../../../store/slices/auth";
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


const EditProfile = () => {
    const theme = useTheme();
    const mainImageRef = useRef(null)
    const profileImageRef = useRef(null)
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    const defaultTemplate = `<h2><strong>A Passion for Sustainable Fashion</strong></h2><p>Hi, I'm Emily Thompson, founder and designer at EcoLux Designs. For as long as I can remember, I've been passionate about creating beautiful clothing that doesn't come at the expense of our planet. My goal has always been to merge the world of luxury fashion with sustainable practices, offering high-end pieces that not only look incredible but are also made with care for the environment.</p><p>At EcoLux Designs, I work with organic fabrics and recycled materials to ensure every garment is as eco-friendly as it is stylish. I believe that fashion can be both timeless and responsible, and my collections reflect that balance. From the design process to production, I’m committed to reducing waste and promoting ethical practices in every step.</p>
    <img src=${brandMain} style="width:100%" height:auto margin:10px 0px;"/>
    <h2><strong>Leading the Movement Toward Eco-Conscious Fashion</strong></h2><p>Sustainability isn’t just a trend for me—it’s at the core of everything I do. My hope is to inspire others to make more conscious choices in their wardrobes while still enjoying the luxury and elegance that fashion can bring. I love collaborating with like-minded individuals and brands, and I’m always exploring new ways to push the boundaries of what sustainable fashion can achieve.</p>
    `;

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useSelector((state) => state.auth);
    const myProfile = id === user.id;

    const { data: myProfileData, isLoading: profileLoading, isSuccess: profileSuccess, isError: isProfileError, error: profileError, isFetching } = useGetUserProfileQuery(null, { refetchOnFocus: true, refetchOnMountOrArgChange: true })
    const [currentIndex, setCurrentIndex] = useState(-1);


    const [profileData, setProfileData] = useState({
        cover: [],
        profileImage: null,
        profileName: "",
        profileAbout: "",
        profileStats: []

    });

    useEffect(() => {
        if (profileSuccess && myProfileData) {
            setProfileData({
                cover: myProfileData?.data?.coverImages || [],
                profileImage: myProfileData?.data?.profileImage,
                profileName: myProfileData?.data?.name,
                profileAbout: myProfileData?.data?.about?.about ? myProfileData?.data?.about?.about : defaultTemplate,
                profileStats: [
                    {
                        name: "Brands:",
                        value: myProfileData?.data?.brandsCount || 0
                    },
                    {
                        name: "Events:",
                        value: myProfileData?.data?.eventsCount || 0
                    },
                    {
                        name: "Spaces:",
                        value: myProfileData?.data?.spacesCount || 0
                    },
                    {
                        name: "Member since:",
                        value: dayjs(myProfileData?.data?.createdAt).format("MM.YYYY.")
                    }
                ]
            });
        }
    }, [profileSuccess, myProfileData]);

    const [profile, { data, isSuccess, isError, error, isLoading }] = useUserProfileUpdateMutation()


    const handleMainFileInputClick = () => {
        mainImageRef.current.click();
    };

    const handleMainImageChange = (files) => {
        if (files) {
            setProfileData((prev) => {
                let coverArray = prev.cover ? [...prev.cover] : [];
                coverArray = [files];
                return { ...prev, cover: coverArray };
            });
        }
    };

    const HandleProfileFileInputClick = () => {
        profileImageRef.current.click();
    }


    const HandleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileData((prev) => ({
                ...prev,
                profileImage: file,
            }));
        }
    };

    const profileTabs = [
        {
            label: "About",
            component: <></>
        },

    ]

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
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }],
                        ['image', 'link'],
                    ],
                },
            });
            quillRef.current.root.innerHTML = profileData?.profileAbout === undefined || profileData?.profileAbout === "" ? defaultTemplate : profileData?.profileAbout;
            quillRef.current.on('text-change', () => {
                const updatedContent = quillRef.current.root.innerHTML;
                setProfileData((prev) => ({
                    ...prev,
                    profileAbout: updatedContent,
                }));
            });
        }
    }, [isEditorVisible]);

    useEffect(() => {
        console.log(profileData)
    }, [profileData])

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message)
            navigate(`/profile/${location?.pathname.split("/").at(-2)}`)
        }
    }, [isSuccess])

    const HandleEdit = () => {
        console.log("HandleEdit function triggered"); // Check if function runs
        console.log("profileData:", profileData); // Check the data before sending

        if (!profileData?.cover || profileData?.cover?.length <= 0) {
            toast?.error("Please upload cover photo of profile.");
            return false;
        }

        if (!profileData?.profileImage) {
            toast?.error("Please upload profile photo.");
            return false;
        }

        if (!profileData?.profileAbout || profileData?.profileAbout.trim() === "") {
            toast?.error("Profile title can not be empty.");
            return false;
        }

        const strippedContent = profileData?.profileAbout?.replace(/<[^>]*>/g, "").trim();
        if (!strippedContent) {
            toast?.error("Profile title can not be empty.");
            return false;
        }

        profile(profileData)
            .unwrap()
            .then((response) => {
                dispatch(updateUser(response?.data));
            })
            .catch((error) => {
                console.error("Error updating profile", error);
            });
    };

    if (profileLoading || isFetching) {
        return (
            <Box sx={{ width: "100%" }}>
                <LinearProgress />
            </Box>
        )
    }

    return (
        <Box
            sx={{
                marginTop: { xs: "0px", md: "80px" },
                display: "flex",
                rowGap: "20px",
                flexDirection: "column",
                backgroundColor: "white",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                pb: "10px",
                marginBottom: "10px"
            }}
        >
            <ProfileCard
                myProfile={myProfile}
                isEdit={true}
                profileImgRef={profileImageRef}
                mainImgRef={mainImageRef}
                handleMainImgChange={handleMainImageChange}
                HandleInputCLick={handleMainFileInputClick}
                cover={profileData?.cover}
                editImage={
                    profileData.cover.length > 0?
                    profileData?.cover[0]?.url ?
                    profileData?.cover[0]?.url :
                    URL.createObjectURL(profileData.cover[0])
                        : []
                }
                handleProfileChange={HandleProfileImageChange}
                handleProfileImgClick={HandleProfileFileInputClick}
                onClick={HandleEdit}
                loading={isLoading}
                userName={profileData?.profileName}
                userProfileImg={profileData?.profileImage}
                profileStats={profileData?.profileStats}
            />
            <OutlinedTabs tabs={profileTabs} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
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
                                cursor: "text",
                                "& ul, & ol": {
                                    paddingLeft: 2,
                                },
                                "& img": {
                                    maxWidth: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                    borderRadius: "5px"
                                },
                            }}
                            onClick={() => setIsEditorVisible(true)}
                        >
                            <Typography
                                variant="body1"
                                color={theme.palette.primary.main}
                                dangerouslySetInnerHTML={{ __html: profileData?.profileAbout === undefined || profileData?.profileAbout === "" ? defaultTemplate : profileData?.profileAbout }}
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
        </Box>
    )
}

export default EditProfile
