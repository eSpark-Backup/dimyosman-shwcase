import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { Button } from "@mui/material";

import { useAuth0 } from "@auth0/auth0-react";

import { apple } from "../../assets";

import { deleteCookie, getCookie, setCookie } from "../../utils";
import { useDispatch } from "react-redux";
import { setAllGeneralData, setAllSearchData, setName, setSearch, setSearchQuery, setSpaceSearchData } from "../../store/slices/search";

const AppleButton = ({
  authBtnStyle,
  register,
  isSuccessRegister,
  isErrorRegister,
  errorRegister,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const logoutSession = getCookie("logout");

  const { loginWithPopup, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
        console.log("User authenticated:", user);

      // if (!logoutSession) {
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
        // setCookie("social_type", "apple");
      // }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isErrorRegister && isAuthenticated) {
      deleteCookie("social_type");
      deleteCookie("search_query");
      dispatch(setSearchQuery(null));
      dispatch(setAllSearchData([]));
      dispatch(setSpaceSearchData([]));
      dispatch(setAllGeneralData([]));
      dispatch(setSearch(""));
      dispatch(setName(""));
      toast.error(errorRegister?.data?.message);
    }
    if (isSuccessRegister && isAuthenticated) {
      navigate("/activity");
    }
  }, [isErrorRegister, isSuccessRegister, navigate, errorRegister, isAuthenticated]);

  return (
    <Button
      sx={authBtnStyle}
      // onClick={() => loginWithPopup({ connection: "apple" })}
    >
      <img src={apple} alt="Apple Logo" />
    </Button>
  );
};

export default AppleButton;