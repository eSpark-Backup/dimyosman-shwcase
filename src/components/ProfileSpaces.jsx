import { Box, Button, LinearProgress, Stack, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import SpaceCard from './SpaceCard';
import { addGrey } from '../assets';
import { useNavigate } from 'react-router-dom';

const ProfileSpaces = ({ myProfile, filter1, filter2, filter3, filter4, cardsData, loading }) => {
    const [selectedChoice, setSelectedChoice] = useState(0)
    const theme = useTheme();
    const navigate = useNavigate()

    if (loading) {
        return (
            <Box sx={{ width: "100%" }}>
                <LinearProgress />
            </Box>
        )
    }
    const filteredItems = cardsData?.filter((item) => {
        if (selectedChoice === 1) return item.status === "PUBLISH";
        if (selectedChoice === 2) return item.status === "DRAFT";
        if (selectedChoice === 3) return item.status === "ARCHIVE";
        return true;
    });
    return (
        cardsData?.length > 0 && <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "20px",
                mt: "50px"
            }}
        >
            {myProfile && <Box
                sx={{
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
                    <Typography sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "400" }}>Show:</Typography>
                    <Typography onClick={() => setSelectedChoice(0)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 0 ? "600" : "400", cursor: "pointer" }}>{filter1}</Typography>
                    <Typography onClick={() => setSelectedChoice(1)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 1 ? "600" : "400", cursor: "pointer" }}>{filter2}</Typography>
                    <Typography onClick={() => setSelectedChoice(2)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 2 ? "600" : "400", cursor: "pointer" }}>{filter3}</Typography>
                    <Typography onClick={() => setSelectedChoice(3)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 3 ? "600" : "400", cursor: "pointer" }}>{filter4}</Typography>
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
                        alignItems: "center",
                        "&:hover": {
                            backgroundColor: "rgb(209, 219, 215, 0.4)",
                        },
                        textTransform: "none"
                    }}
                    onClick={() => navigate("/new-space")}
                >
                    <img src={addGrey} alt="" />
                    Add New
                </Button>

            </Box>}
            <Stack
                marginTop={2}
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                rowGap={4}
                columnGap={0}
            >
                {filteredItems?.length > 0 ? filteredItems.map((space, ind) => (
                    <Box key={ind} sx={{ width: { xs: "100%", md: "328px" } }}>
                        <SpaceCard myProfile={myProfile} spaces={space} showBtn={true} />
                    </Box>
                ))
                :
                    <Typography sx={{width: "100%"}} fontWeight={700} textAlign="center">No Data</Typography>
                }
            </Stack>
        </Box>
    )
}

export default ProfileSpaces
