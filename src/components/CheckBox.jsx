// CustomCheckbox.js
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import { checkedIcon, uncheckedIcon } from '../assets';

export default function CheckBox({ checked, onChange }) {
    return (
        <Box
            sx={{
                width: "24px",
                height: "24px",
                background: checked ? "#314247" : "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: !checked ? "1px solid #00141C" : "none",
                borderRadius: "3px"
            }}
        >
            <Checkbox
                checked={checked}
                onChange={onChange}
                icon={<img src={uncheckedIcon} alt="Unchecked Icon" style={{ width: "20px", height: "20px" }} />}
                checkedIcon={<img src={checkedIcon} alt="Checked Icon" style={{ width: "20px", height: "20px" }} />}
            />
        </Box>
    );
}
