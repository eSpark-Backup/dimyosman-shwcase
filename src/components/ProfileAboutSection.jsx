import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'

const ProfileAboutSection = ({ content }) => {
    const theme = useTheme()
    return (
        <Box sx={{ mt: "50px" }}>
            {
                content?.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            {
                                item?.type === "heading"
                                    ?
                                    <Typography
                                        variant='h3'
                                        sx={{
                                            textAlign: "left",
                                            color: theme.palette.primary.main,
                                            fontWeight: "600",

                                        }}
                                    >
                                        {item?.content}
                                    </Typography>
                                    :
                                    item?.type === "paragraph"
                                        ?
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                textAlign: "left",
                                                color: theme.palette.primary.main,
                                                fontWeight: "400",
                                            }}
                                        >
                                            {item?.content}
                                        </Typography>
                                        :
                                        item?.type === "breaker"
                                            ?
                                            <br />
                                            :
                                            <img src={item?.content} style={{ width: "100%" }} />
                            }
                        </React.Fragment>
                    )
                })
            }
        </Box>
    )
}

export default ProfileAboutSection
