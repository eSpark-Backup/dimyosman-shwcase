import { Box, Typography } from '@mui/material'
import React from 'react'
import { miniMap } from '../assets'
import Input from './input'

const InputWithMap = ({ inputLabel, inputValue, setInputValue, handleClick }) => {
  return (
    <Box
      sx={{
        width: "98%",
        display: "flex",
        justifyContent: "space-between",
        rowGap: "10px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "65%" }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "3px"
          }}

        >
          <Typography variant='h3' sx={{ textAlign: "left", color: "#00141C", fontWeight: "600" }}>{inputLabel}</Typography>
          <Input value={inputValue} onInputChange={(e) => setInputValue(e.target.value)} multiline={true} sx={{ height: "auto", fontWeight: "400", py: "10px", px: "10px" }} />
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          rowGap: "10px"
        }}
      >
        <Typography
          sx={{
            textAlign: "left"
          }}
          variant='h6'
        >
          Headqarters at:
        </Typography>
        <img src={miniMap} alt="Map" onClick={handleClick} style={{ cursor: "pointer" }} />
        <Typography
          sx={{
            textAlign: "left"
          }}
          variant='h6'
        >
          Select location
        </Typography>
      </Box>
    </Box>
  )
}

export default InputWithMap
