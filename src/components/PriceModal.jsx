import { Box, Button, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { PriceColumns } from '../columns/price';

const PriceModal = ({handleClose}) => {
    const theme = useTheme();
    const [items, setItems] = useState([
        { id: 1, price: "$200", term: "Day", minimum: "7", select: false },
        { id: 2, price: "$1000", term: "Week", minimum: "2", select: false },
        { id: 3, price: "$4000", term: "Month", minimum: "3", select: false },
        { id: 4, price: "$400000", term: "Year", minimum: "2", select: false },
    ]);

    const columns = PriceColumns({ items, setItems });
    
    const handleSelectClick = () => {
        const selectedItems = items.filter((item) => item.select);
        handleClose(selectedItems);
    };
    return (
        <>
            <Box
                sx={{
                    border: "1px solid rgba(209, 219, 215, 0.5)",
                    borderRadius: "3px",
                    pb: "16px"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "rgb(209, 219, 215, 0.3)",
                        // height: "40px",
                        alignItems: "center",
                        pl: '16px',
                        py: "16px",
                    }}
                >
                    {columns.map((column) => (
                        <Box key={column.key} sx={{ width: column.width, display: column?.key !== "select" && "flex", justifyContent: column?.key !== "select" && "center", alignItems: column?.key !== "select" && "center" }}>
                            {column.headerComponent || column.name}
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        pl: '16px',
                        py: "16px",
                        flexDirection: "column",
                        rowGap: "20px"
                    }}
                >
                    {items.map((item, index) => (
                        <Box key={item.id} display="flex" mb={1} sx={{ justifyContent: "space-between" }}>
                            {columns.map((column) => (
                                <Box
                                    key={column.key}
                                    sx={{
                                        width: column.width,
                                        ...(column.key === "term" && {
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }),
                                        ...(column.key === "select" && {
                                            display: "flex",
                                            // justifyContent: "center",
                                            alignItems: "center",
                                        }),

                                    }}
                                >
                                    {column.component ? column.component(item[column.key], index) : item[column.key]}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", pb: "12px" }}>
                <Button
                    sx={{
                        height: "31px",
                        width: "92px",
                        background: "rgba(209, 219, 215, 0.4)",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: theme.palette.primary.main,
                        "&:hover": { backgroundColor: "rgba(209, 219, 215, 0.4)" }
                    }}
                    onClick={handleSelectClick}
                >
                    Select
                </Button>
            </Box>
        </>
    );
};

export default PriceModal;
