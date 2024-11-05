import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EventCard from './EventCard';

const ProfileEvents = () => {
    const theme = useTheme();
    const { events } = useSelector((state) => state.event);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        console.log("Selected state updated:", selected);
    }, [selected]);

    return (
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
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    rowGap: "10px"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        columnGap: "16px",
                        flexDirection: "row",
                        rowGap: "2px"
                    }}
                >
                    <Typography variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "400" }}>Show:</Typography>
                    <Box onClick={() => setSelected(0)}>
                        <Typography

                            variant='h5'
                            sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selected === 0 ? "600" : "400", cursor: "pointer" }}
                        >
                            All
                        </Typography>
                    </Box>
                    <Box onClick={() => setSelected(1)}>
                        <Typography

                            variant='h5'
                            sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selected === 1 ? "600" : "400", cursor: "pointer" }}
                        >
                            Upcoming
                        </Typography>
                    </Box>
                    <Box onClick={() => setSelected(2)}>
                        <Typography

                            variant='h5'
                            sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selected === 2 ? "600" : "400", cursor: "pointer" }}
                        >
                            Past
                        </Typography>
                    </Box>
                </Box>
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
                {events.map((event, ind) => (
                    <Box key={ind} sx={{ width: { xs: "100%", md: "328px" } }}>
                        <EventCard event={event} showBtn={true} />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default ProfileEvents;
