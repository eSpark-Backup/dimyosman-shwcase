import { Badge, Box, useTheme } from '@mui/material';
import React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { addIcon } from '../assets';

const BadgeComp = ({ onClick, imageSrc, bg }) => {
    const theme = useTheme();
    return (
        <Box
            onClick={onClick}
            sx={{
                backgroundColor: "rgb(0, 20, 28, 0.4)",
                width: "32px",
                height: "32px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                cursor: "pointer",
                display: 'flex',
                position: "relative"
            }}
        >
            <img src={imageSrc} alt="icon" />
            <Box
                sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: bg,
                    position: "absolute",
                    top: "-4px",
                    right: "-3px"
                }}
            >

            </Box>
        </Box>
    );
};

export default BadgeComp;
