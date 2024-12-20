import { Box } from "@mui/material";
import { CheckBox, Input } from "../components";
import { useEffect, useState } from "react";

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

    const handleInputChange = (index, key, value) => {
        const updatedItems = items.map((item, idx) =>
            idx === index ? { ...item, [key]: value } : item
        );
        setItems(updatedItems);
    };

    return [
        {
            name: "Select",
            key: "select",
            // width: "56px",
            width: "20%",
            // headerComponent: (
            //     <CheckBox
            //         checked={selectAll}
            //         onChange={handleSelectAllChange}
            //     />
            // ),
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
            width: "30%",
            component: (item, index) => {
                return (
                    <Input
                        onInputChange={(e) => handleInputChange(index, "price", e.target.value)}
                        value={item ? item : ""}  // Bind value to item.price
                        placeholder={"Enter Price"}
                        name={"price"}
                        type={"number"}
                        sx={{ height: "60px" }}
                    />
                );
            }
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
            component: (item, index) => (
                <Input
                    onInputChange={(e) => handleInputChange(index, "minimum", e.target.value)}
                    value={item ? item : ""}  // Bind value to item.minimum
                    placeholder={"Enter Minimum"}
                    name={"minimum"}
                    type={"number"}
                    sx={{ height: "60px" }}
                />
            )
        }
    ];
};