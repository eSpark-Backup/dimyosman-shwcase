import { Badge, Box } from '@mui/material';
import React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { addIcon } from '../assets';

const BadgeComp = ({ imageSrc, bg }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#99A1A4",
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
