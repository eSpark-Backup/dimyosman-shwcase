import { Box } from "@mui/material";
import { CheckBox } from "../components";
import { useState } from "react";

export const PriceColumns = ({ items, setItems }) => {
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setItems(items.map(item => ({ ...item, select: newSelectAll })));
    };

    const handleSelectChange = (index) => {
        const updatedItems = items.map((item, idx) =>
            idx === index ? { ...item, select: !item.select } : item
        );
        setItems(updatedItems);
        setSelectAll(updatedItems.every(item => item.select));
    };

    return [
        {
            name: "Select",
            key: "select",
            // width: "56px",
            width: "20%",
            headerComponent: (
                <CheckBox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            ),
            component: (item, index) => (
                <CheckBox
                    checked={item || false}
                    onChange={() => handleSelectChange(index)}
                />
            )
        },
        {
            name: "Price",
            key: "price",
            // width: "180px",
            width: "30%",
            component: (item) => (
                <Box
                    sx={{
                        // width: "180px",
                        width: "100%",
                        py: "16px",
                        px: "16px",
                        backgroundColor: "rgb(209, 219, 215, 0.2)",
                        border: "1px dashed rgb(0, 20, 28, 0.4)",
                        borderRadius: "3px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {item}
                </Box>
            )
        },
        {
            name: "Term",
            key: "term",
            // width: "100px"
            width: "25%",
        },
        {
            name: "Minimum",
            key: "minimum",
            // width: "100px",
            width: "25%",
            component: (item) => (
                <Box
                    sx={{
                        // width: "100px",
                        width: "100%",
                        py: "16px",
                        px: "16px",
                        backgroundColor: "rgb(209, 219, 215, 0.2)",
                        border: "1px dashed rgb(0, 20, 28, 0.4)",
                        borderRadius: "3px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {item}
                </Box>
            )
        }
    ];
};
