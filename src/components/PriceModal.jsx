import { Box, Button, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { PriceColumns } from '../columns/price';
import { toast } from 'react-toastify';

const PriceModal = ({ handleClose, data }) => {
    const theme = useTheme();
    const [items, setItems] = useState([
        { id: 1, price: undefined, term: "Day", minimum: undefined, select: true },
        { id: 2, price: undefined, term: "Week", minimum: undefined, select: false },
        { id: 3, price: undefined, term: "Month", minimum: undefined, select: false },
        { id: 4, price: undefined, term: "Year", minimum: undefined, select: false },
    ]);

    const columns = PriceColumns({ items, setItems });

    useEffect(() => {
        if (data) {
            const updatedItems = items.map(item => {
                const matchingData = data.find(d => d.term === item.term);
                if (matchingData) {
                    return {
                        ...item,
                        price: Number(matchingData.price),
                        minimum: Number(matchingData.minimum),
                        select: true
                    };
                }
                return item;
            });
            setItems(updatedItems);
        }
    }, [data]);


    const handleSelectClick = () => {
        const selectedItems = items.filter((item) => item.select);

        const dayFilter = selectedItems.filter((item) => item.term === "Day");
        if (dayFilter.length === 0) {
            toast.error("Selecting price & minimum lease days for Day is required.");
            return;
        }

        const incompleteItems = selectedItems.filter(
            (item) =>
                !item.price ||
                !Number.isInteger(Number(item.price)) ||
                Number(item.price) < 1 ||
                !item.minimum ||
                !Number.isInteger(Number(item.minimum)) ||
                Number(item.minimum) < 1
        );

        if (incompleteItems.length > 0) {
            toast.error("Please fill out price and minimum with whole numbers greater than or equal to 1 for all selected items.");
            return;
        }

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
                                    {column.component ? column.component(item[column.key], index, item.term) : item[column.key]}
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
