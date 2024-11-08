import React from 'react';
import { Modal as MuiModal, Box, Typography, useTheme } from '@mui/material';
import { close } from '../assets';

const ReusableModal = ({ open, handleClose, children, heading, hideHeader }) => {
    const theme = useTheme();
    return (
        <MuiModal
            open={open}
            onClose={handleClose}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: { xs: "95vw", sm: "60vw", md: "50vw", lg: "40vw", xl: "30vw" },
                    backgroundColor: !hideHeader && theme.palette.primary.contrastText,
                    borderRadius: "5px",
                    padding: "10px 20px",
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "16px"
                }}
            >
                {
                    !hideHeader &&
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "20px",
                                fontWeight: "600",
                                color: theme.palette.primary.main
                            }}
                        >
                            {heading}
                        </Typography>
                        <img src={close} alt="Close Icon" style={{ cursor: "pointer" }} onClick={handleClose} />
                    </Box>
                }
                {children}
            </Box>
        </MuiModal>
    );
}

export default ReusableModal;
