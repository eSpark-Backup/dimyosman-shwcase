import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import logo from '../assets/web-logo.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthBox = ({ title, subTitle, children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(location.pathname === '/register' ? 1 : 0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
        navigate(newValue === 0 ? '/login' : '/register');
    };


    useEffect(() => {
        setActiveTab(location.pathname === '/register' ? 1 : 0);
    }, [location.pathname]);

    return (
        <div className="auth-main">
            <div className="auth-box">
                <img src={logo} alt="Logo" />
                <Tabs value={activeTab} onChange={handleChange} indicatorColor='transparent' textColor='transparent'>
                    <Tab
                        label="LOGIN"
                        sx={{
                            backgroundColor: activeTab === 0 ? "#D1DBD7" : "#f6f8f7",
                            borderRadius: "3px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#00141C",
                            width: "120px"
                        }}
                    />
                    <Tab
                        label="SIGNUP"
                        sx={{
                            backgroundColor: activeTab === 1 ? "#D1DBD7" : "#f6f8f7",
                            borderRadius: "3px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#00141C",
                            width: "120px"
                        }}
                    />
                </Tabs>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "10px",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "26px",
                            color: "#00141C",
                            fontWeight: "500"
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "18px",
                            color: "#00141C",
                            fontWeight: "500"
                        }}
                    >
                        {subTitle}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: "column",
                        alignItems: "center",
                        rowGap: "32px"
                    }}
                >
                    {children}
                </Box>
            </div>
        </div>
    );
};

export default AuthBox;
