import { Box, Button, Typography, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { shareHovered, shareNotHovered } from '../assets'
import { useClickOutside } from '../utils'
import ShareModal from './shareModal'
import { toast } from 'react-toastify'

const ProfileAboutSection = ({ myProfileData, content }) => {
    const token = window.localStorage.getItem("token");
    const theme = useTheme()
    const [showShareBox, setShowShareBox] = useState(false)
    const shareBoxRef = useRef(null);
    const [isIconHovered, setIsIconHovered] = useState(false)

    useClickOutside(shareBoxRef, () => setShowShareBox(false));

    return (
        <Box sx={{ my: "50px" }}>
            <Typography
                fontSize={16}
                sx={{
                    textAlign: "left",
                    marginTop: 2,
                    fontWeight: 400,
                    wordBreak: "break-word",
                    "& ul, & ol": {
                        paddingLeft: 2,
                    },
                    "& img": {
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                    },
                }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
            <Box sx={{ marginTop: "30px", position: "relative", width: "100%" }}>
                <Button
                    sx={{
                        backgroundColor: "transparent",
                        maxWidth: "10.68px",
                        minWidth: "10.68px",
                        maxHeight: "17.68px",
                        "&:hover": { backgroundColor: "transparent" }
                    }}
                    onClick={() => !token ? toast.error("You need to login first") : setShowShareBox(true)}
                    onMouseEnter={() => setIsIconHovered(true)}
                    onMouseLeave={() => setIsIconHovered(false)}>

                    <figure
                        style={{ width: "100%", height: "100%" }}
                        role="img"

                    >
                        <img src={isIconHovered ? shareHovered : shareNotHovered} alt="Share Icon" />
                    </figure>
                </Button>
                <ShareModal myProfileData={myProfileData} shareableLink={myProfileData?.shareableLink} open={showShareBox} handleClose={() => setShowShareBox(false)} profile />
            </Box>
        </Box >
    )
}

export default ProfileAboutSection
