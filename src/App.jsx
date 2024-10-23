import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Header, AuthBox } from './layout'
import './App.css'
import { useEffect, useState } from 'react'

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      setIsLogin(true);
    }
    else {
      setIsLogin(false);
    }
  }, [token, navigate])

  return (
    <>
      <Header isLogin={isLogin} />
      <Routes>
        <Route path='/' element={<Navigate to={"/auth?type=login"} />} />
        <Route path='/auth' element={<AuthBox />} />
        <Route path='*' element={<Navigate to={"/auth?type=login"} />} />
      </Routes>
    </>
  )
}

export default App
