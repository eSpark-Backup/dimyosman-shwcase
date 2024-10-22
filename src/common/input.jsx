import { Box } from '@mui/material'
import React from 'react'

const Input = ({ onInputChange, name, label, type, placeholder, value }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
            <label htmlFor={name} className='input-label'>{label}</label>
            <input className='custom-input' type={type} name={name} placeholder={placeholder} onChange={(e) => onInputChange(name, e.target.value)} value={value} />
        </Box>
    )
}

export default Input
