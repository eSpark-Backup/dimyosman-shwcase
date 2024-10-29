// CustomCheckbox.js
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import { checkedIcon, uncheckedIcon } from '../assets';
import { Box } from '@mui/material';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    // Ensure the checkbox has a defined size
    '& .MuiSvgIcon-root': {
        fontSize: 20,
        width: "20px", // Set default width for the box
        height: "20px", // Set default height for the box
    },
    '&.Mui-checked': {
        color: "red",
        '& .MuiSvgIcon-root': {
            backgroundColor: "red",
            borderRadius: "3px",
        },
    },
    '&.Mui-unchecked': {
        color: "blue",
        '& .MuiSvgIcon-root': {
            backgroundColor: "blue",
            borderRadius: "3px",
        },
    },
    '&:hover': {
        backgroundColor: 'transparent',
    },
}));

export default function CheckBox({ checked, onChange }) {
    return (
        <Box sx={{ width: "24px", height: "24px", background: checked ? "#00141C" : "transparent", display: "flex", justifyContent: "center", alignItems: "center", borderStyle: !checked && "solid", borderWidth: !checked && "1px", borderColor: !checked && "#00141C", borderRadius: "3px" }}>
            <CustomCheckbox
                checked={checked}
                onChange={onChange}
                icon={<img src={uncheckedIcon} alt='Unchecked Icon' style={{ width: "20px", height: "20px" }} />}
                checkedIcon={<img src={checkedIcon} alt='Checked Icon' style={{ width: "20px", height: "20px" }} />}
            />
        </Box>
    );
}
