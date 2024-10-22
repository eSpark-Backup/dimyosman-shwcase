import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { AuthBox } from "../../../components"
import Input from '../../../common/input'
import googleLogo from "../../../assets/Google-logo.svg"
import facebookLogo from "../../../assets/Facbook-logo.svg"
import appleLogo from "../../../assets/Apple-logo.svg"
import { Link } from 'react-router-dom'

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const handleChange = (name, value) => {
        setForm((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    }
    return (
        <div>
            <AuthBox title={"Welcome back!"} subTitle={"Enter your credentials to continue."}>
                <Box
                    sx={{
                        width: { xs: "90%", sm: "85%", md: "70%" },
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "16px",
                    }}
                >
                    <Input onInputChange={handleChange} label={"email"} name={"email"} type={"email"} value={form.email} placeholder={"Type Your Email"} />
                    <Input onInputChange={handleChange} label={"password"} name={"password"} type="password" value={form.password} placeholder={"Type Your Password"} />
                    <Typography sx={{ color: "Forgot Password?", fontSize: "12px", fontWeight: "500", textDecoration: "underline", cursor: "pointer" }}>
                        Forgot Password?
                    </Typography>
                    <Button sx={{ backgroundColor: "#4D5B60", height: '46px', borderRadius: "5px", color: "white", fontSize: "20px", fontWeight: "500" }}>
                        Log In
                    </Button>

                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px" }}>
                    <Typography sx={{ color: "#00141C", fontSize: "12px", fontWeight: "500", textAlign: "center" }}>
                        By logging, you are agreeing with our
                    </Typography>
                    <Typography sx={{ color: "#00141C", fontSize: "12px", fontWeight: "500", textAlign: "center" }}>
                        <span style={{ textDecoration: "underline" }}>Terms of Use </span>
                        and
                        <span style={{ textDecoration: "underline" }}> Privacy Policy</span>
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px", width: "100%" }}>
                    <Typography sx={{ color: "#00141C", fontSize: "12px", fontWeight: "500", textAlign: "center" }}>
                        Or connect via
                    </Typography>
                    <Box sx={{ display: "flex", columnGap: "12px", flexDirection: { xs: "column", md: "row", width: "100%", justifyContent: "center", alignItems: "center", rowGap: "10px" } }}>
                        <Button sx={{ width: { xs: "90%", md: "110px" }, height: "50px", borderRadius: "10px", border: "2px solid #DDDDDD", backgroundColor: "#F8F8F8", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={googleLogo} alt="Google Logo" />
                        </Button>
                        <Button sx={{ width: { xs: "90%", md: "110px" }, height: "50px", borderRadius: "10px", border: "2px solid #DDDDDD", backgroundColor: "#F8F8F8", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={facebookLogo} alt="Facebook Logo" />
                        </Button>
                        <Button sx={{ width: { xs: "90%", md: "110px" }, height: "50px", borderRadius: "10px", border: "2px solid #DDDDDD", backgroundColor: "#F8F8F8", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={appleLogo} alt="Apple Logo" />
                        </Button>
                    </Box>
                </Box>
                <Typography sx={{ color: "#00141C", fontSize: "12px", fontWeight: "500", textAlign: "center" }}>
                    Don’t have an account? <Link to={"/register"}><span style={{ textDecoration: "underline", cursor: "pointer", color: "#00141C" }}>Sign Up!</span></Link>
                </Typography>
            </AuthBox>
        </div>
    )
}

export default Login
