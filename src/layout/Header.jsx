import { useEffect, useState } from "react";
import { Button, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { logo, user, userProfile } from "../assets";
import { BadgeComp, SearchBar } from "../components";
import { addIcon, chatIcon, bellIcon } from "../assets";

const Header = ({ isLogin }) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      html.style.overflow = isOpen ? "hidden" : "auto";
    }
  }, [isOpen]);
  return (
    <>
      <div className="header">
        <nav>
          <div className="logo">
            <img src={logo} alt="Website Logo" />
          </div>
          {isLogin
            &&
            <div className="search-bar">
              <div className="search-box">
                <SearchBar name={"query"} placeholder={"Search..."} />
              </div>
            </div>
          }
          {
            isLogin ?
              <ul className={`${isOpen ? "nav-links2 active" : "nav-links2"}`}>
                <li>
                  <BadgeComp imageSrc={addIcon} bg={theme.palette.transparent} />
                </li>
                <li>
                  <BadgeComp imageSrc={chatIcon} bg={theme.palette.error.danger} />
                </li>
                <li>
                  <BadgeComp imageSrc={bellIcon} bg={theme.palette.error.danger} />
                </li>
                <img src={userProfile} alt="User" style={{ cursor: "pointer" }} />
              </ul>
              :
              <ul className={`${isOpen ? "nav-links active" : "nav-links"}`}>
                <li onClick={() => setIsOpen(false)}>News</li>
                <hr className="nav-items-breaker" />
                <li onClick={() => setIsOpen(false)}>About</li>
                <hr className="nav-items-breaker" />
                <li onClick={() => setIsOpen(false)}>Help</li>
                <Button className="user-btn1" sx={{
                  minWidth: "32px",
                  height: "32px",
                  backgroundColor: "rgba(0, 20, 28, 0.8)",
                  ":hover": {
                    backgroundColor: "rgba(0, 20, 28, 0.8)"
                  }
                }}>
                  <img src={user} alt="User" />
                </Button>
              </ul>
          }

          <div className="icon" onClick={toggleMenu}>
            {!isLogin && <Button sx={{
              minWidth: "32px",
              height: "32px",
              backgroundColor: "rgba(0, 20, 28, 0.8)",
              ":hover": {
                backgroundColor: "rgba(0, 20, 28, 0.8)"
              }
            }}>
              <img src={user} alt="User" />
            </Button>}
            {isOpen ? <CloseOutlinedIcon /> : <MenuIcon />}
          </div>
        </nav>
      </div >
    </>
  );
};

export default Header;
