import React, { useEffect, useState } from 'react'
import logo from "../assets/web-logo.svg"
import MenuIcon from '@mui/icons-material/Menu';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import user from "../assets/user.svg"
import { Button } from '@mui/material';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const html = document.querySelector("html")
    if (html) {
      html.style.overflow = isOpen ? "hidden" : "auto"
    }
  }, [isOpen])
  return (
    <>
      <div className='header'>
        <nav>
          <div className="logo">
            <img src={logo} alt="Website Logo" />
          </div>
          <ul className={`${isOpen ? "nav-links active" : "nav-links"}`}>
            <li onClick={() => setIsOpen(false)}>News</li>
            <hr className='nav-items-breaker' />
            <li onClick={() => setIsOpen(false)}>About</li>
            <hr className='nav-items-breaker' />
            <li onClick={() => setIsOpen(false)}>Help</li>
            <Button sx={{
              height: "45px",
              width: "32px",
              backgroundColor: "#334349",
              borderRadius: "5px"
            }} className='user-btn1'>
              <img src={user} alt="User" />
            </Button>
          </ul>
          <div className="icon" onClick={toggleMenu}>
            <Button sx={{
              height: "45px",
              width: "32px",
              backgroundColor: "#334349",
              borderRadius: "5px"
            }}>
              <img src={user} alt="User" />
            </Button>
            {isOpen ? <CloseOutlinedIcon /> : <MenuIcon />}
          </div>
        </nav>
      </div>
      <section>
        <div className="container">
          <div className="content">
          </div>
        </div>
      </section>
    </>
  )
}

export default Header
