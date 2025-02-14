import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "@mui/material";

import { facebook } from "../../assets";
import { deleteCookie, getCookie, setCookie } from "../../utils";

const FacebookButton = ({
  authBtnStyle,
  register,
  isSuccessRegister,
  isErrorRegister,
  errorRegister,
}) => {
  const navigate = useNavigate();
  const logoutSession = getCookie("logout");

  const { loginWithPopup, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      if (!logoutSession) {
        console.log("User authenticated:", user);
        
        // register({
        //   firstName: user.given_name,
        //   lastName: user.family_name,
        //   email: user.email,
        //   loginType: "facebook",
        //   isSocialLogin: true,
        //   role: "user",
        //   socialId: user.sub?.split("|")[1],
        //   profileImage: user.picture,
        // });
        // setCookie("social_type", "facebook");
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isErrorRegister) {
      deleteCookie("social_type");
      toast.error(errorRegister?.data?.message);
    }
    if (isSuccessRegister) {
      navigate("/activity");
    }
  }, [isErrorRegister, isSuccessRegister, navigate, errorRegister]);

  return (
    <Button
      sx={authBtnStyle}
      onClick={() =>
        loginWithPopup({
          connection: "facebook",
        })
      }
    >
      <img src={facebook} alt="Facebook Logo" />
    </Button>
  );
};

export default FacebookButton;