import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "@mui/material";

import { google } from "../../assets";

import { deleteCookie, getCookie, setCookie } from "../../utils";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../store/slices/search";

const GoogleButton = ({
  authBtnStyle,
  register,
  isSuccessRegister,
  isErrorRegister,
  errorRegister,
  setAuthLoading,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const logoutSession = getCookie("logout");

  const { loginWithPopup, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      if (!logoutSession) {
        register({
          firstName: user.name,
          email: user.email,
          loginType: "google",
          isSocialLogin: true,
          role: "user",
          socialId: user.sub?.split("|")[1],
          profileImage: user.picture,
        });

        setCookie("social_type", "google");
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isErrorRegister && isAuthenticated) {
      deleteCookie("social_type");
      deleteCookie("search_query");
      dispatch(setSearchQuery(null));
      toast.error(errorRegister?.data?.message);
    }
    if (isSuccessRegister && isAuthenticated) {
      navigate("/activity");
    }
  }, [isErrorRegister, isSuccessRegister, navigate, errorRegister, isAuthenticated]);

  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      await loginWithPopup({
        connection: "google-oauth2",
        authorizationParams: {
          prompt: "login",
        },
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Button sx={authBtnStyle} onClick={handleLogin}>
      <img src={google} alt="Google Logo" />
    </Button>
  );
};

export default GoogleButton;
