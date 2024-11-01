import { Box, Divider, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { arrowDown, miniMap } from '../assets'
import Input from './input'

const InputWithMap = ({ inputLabel, inputValue, setInputValue, handleClick, mapDescription, activity, eventName, eventAddress }) => {
  const theme = useTheme();
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
          <Typography variant='h3' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "600" }}>{inputLabel}</Typography>
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
          {
            activity === "brand"
              ?
              "Headqarters at:"
              :
              "Hosted at:"
          }
        </Typography>
        {
          activity === "event"
          &&
          <Box
            sx={{
              width: "100%",
              height: "60px",
              border: "1px dashed rgb(0, 20, 28, 0.4)",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgb(209, 219, 215, 0.2)",
              px: "10px"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "5px"
              }}
            >
              <Typography
                variant='h5'
                sx={{
                  textAlign: "left",
                  fontWeight: "600",
                  color: theme.palette.primary.dark
                }}
              >
                {eventName}
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  textAlign: "left",
                  fontWeight: "300",
                  color: theme.palette.primary.main
                }}
              >
                {eventAddress}
              </Typography>
            </Box>
            <img src={arrowDown} alt="Down Arrow" />
          </Box>
        }
        <img src={miniMap} alt="Map" onClick={handleClick} style={{ cursor: "pointer" }} />
        <Typography
          sx={{
            textAlign: "left",
            fontWeight: "300",
            fontStyle: "italic"
          }}
          variant='h6'
        >
          {mapDescription}
        </Typography>
        {
          activity === "event"
          &&
          <>
            <Divider />
            <Typography
              sx={{
                textAlign: "left"
              }}
              variant='h6'
            >
              Starting from:
            </Typography>
            <Box
              onClick={() => setOpenDatePicker(true)}
              sx={{
                width: "100%",
                // height: "72px",
                border: "1px dashed rgb(0, 20, 28, 0.4)",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
                backgroundColor: "rgb(209, 219, 215, 0.2)",
                p: "10px",
                flexDirection: "column",
                cursor: "pointer"
              }}
            >
              <Typography
                variant='h1'
                sx={{
                  color: theme.palette.primary.main,
                  textAlign: "left"
                }}
              >
                28.02.2025.
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  color: theme.palette.primary.main
                }}
                variant='h6'
              >
                until 15.4.2025.
              </Typography>
            </Box>
          </>
        }
      </Box>
    </Box>
  )
}

export default InputWithMap
