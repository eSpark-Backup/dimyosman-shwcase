import { Box, Button, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EventCard from './EventCard';
import { addGrey } from '../assets';
import { useNavigate } from 'react-router-dom';

const ProfileEvents = ({ filter1, filter2, filter3, filter4, filter5, filter6, filter7, cardsData, loading }) => {
    const theme = useTheme();
    const [selectedChoice, setSelectedChoice] = useState(0);
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
        if (selectedChoice === 4) return item.eventStatus === "Upcoming";
        if (selectedChoice === 5) return item.eventStatus === "Ended";
        if (selectedChoice === 6) return item.eventStatus === "Ongoing";
        return true; // Show all if selectedChoice is 0
    });
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "20px",
                mt: "50px"
            }}
        >
            <Box
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
                    <Typography onClick={() => setSelectedChoice(4)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 4 ? "600" : "400", cursor: "pointer" }}>{filter5}</Typography>
                    <Typography onClick={() => setSelectedChoice(5)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 5 ? "600" : "400", cursor: "pointer" }}>{filter6}</Typography>
                    <Typography onClick={() => setSelectedChoice(6)} sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 6 ? "600" : "400", cursor: "pointer" }}>{filter7}</Typography>
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
                    onClick={() => navigate("/new-event")}
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
                {filteredItems?.length > 0 ? filteredItems?.map((event, ind) => (
                    <Box key={ind} sx={{ width: { xs: "100%", md: "328px" } }}>
                        <EventCard event={event} showBtn={true} edit={true} />
                    </Box>
                ))
                :
                    <Typography sx={{width: "100%"}} fontWeight={700} textAlign="center">No Data</Typography>
                }
            </Stack>
        </Box>
    );
};

export default ProfileEvents;
