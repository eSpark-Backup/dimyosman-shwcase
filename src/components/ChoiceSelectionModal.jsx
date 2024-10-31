import React, { useState } from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import SearchBar from './SearchBar';
import { useTheme } from '@emotion/react';

const ChoiceSelectionModal = ({
    categories,
    onSelect,
    maxSelections = 5,
    minSelections = 1,
    title = "Select Categories",
    description = "Selected Brand categories are inherited by Events and Spaces, allowing them for individual selection.",
    placeholder = "Search...",
    handleClose
}) => {
    const theme = useTheme();
    const [searchValue, setSearchValue] = useState("");
    const [selectedItems, setSelectedItems] = useState(categories);

    const handleCheckboxChange = (index) => {
        const updatedSelection = selectedItems.map((cat, i) =>
            i === index ? { ...cat, selected: !cat.selected } : cat
        );
        setSelectedItems(updatedSelection);
    };

    const handleSelectClick = () => {
        const selectedCategories = selectedItems.filter(cat => cat.selected);
        if (selectedCategories.length < minSelections) {
            alert(`Please select at least ${minSelections} category(ies)`);
            return;
        }
        if (selectedCategories.length > maxSelections) {
            alert(`You can select at most ${maxSelections} categories`);
            return;
        }
        onSelect(selectedItems);
        handleClose();
    };

    const filteredItems = searchValue !== ""
        ? selectedItems.filter(cat => cat.name.toLowerCase().includes(searchValue.toLowerCase()))
        : selectedItems;

    return (
        <Box sx={{ padding: "0px", display: "flex", flexDirection: "column", rowGap:"10px" }}>
            <SearchBar placeholder={placeholder} value={searchValue} onInputChange={(e) => setSearchValue(e.target.value)} />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "16px",
                    padding: "0px",
                    border: "1px solid rgba(209, 219, 215, 0.5)",
                    borderRadius: "5px",
                    maxHeight: "345px",
                    overflowY: "auto"
                }}
            >
                {filteredItems.map((cat, index) => (
                    <Box key={cat.name} display="flex" alignItems="center" marginBottom={1}>
                        <Checkbox
                            checked={cat.selected}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <Typography>{cat.name}</Typography>
                    </Box>
                ))}
            </Box>

            <Typography sx={{ fontSize: "14px", color: theme.palette.primary.main, fontStyle: "italic" }}>
                {minSelections}min - {maxSelections}max.
            </Typography>
            <Typography sx={{ fontSize: "14px", color: theme.palette.primary.main, fontStyle: "italic" }}>
                {description}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        </Box>
    );
};

export default ChoiceSelectionModal;
