import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import { Header, AuthBox, DashboardLayout } from "./layout";
import {
  Activity,
  Brand,
  BrandDetails,
  Calendar,
  EditBrand,
  Event,
  Message,
  NewBrand,
  Profile,
  Settings,
  Space,
} from "./pages";

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const { pathname } = useLocation()
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      if (pathname !== "/auth") {
        setIsLogin(true)
      }
      else {
        setIsLogin(false)
      }
    }
    else {
      setIsLogin(false);
      // navigate("/auth?type=login")
    }
  }, [token, pathname])

  return (
    <>
      <Header isLogin={isLogin} />
      <Routes>
        <Route path="/" element={<Navigate to={"/auth?type=login"} />} />
        <Route path="/auth" element={<AuthBox />} />
        <Route path="*" element={<Navigate to={"/auth?type=login"} />} />

        <Route element={<DashboardLayout />}>
          <Route path="/activity" element={<Activity />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/brand/:id" element={<BrandDetails />} />
          <Route path="/event" element={<Event />} />
          <Route path="/space" element={<Space />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/message" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-brand" element={<NewBrand />} />
          <Route path="/brand/:brand-id/edit" element={<EditBrand />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
