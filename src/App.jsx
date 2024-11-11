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
  EditEvent,
  EditProfile,
  Event,
  EventDetails,
  Message,
  NewBrand,
  NewEvent,
  NewSpace,
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
          {/* <Route path="/event/:id" element={<EventDetails />} /> */}
          <Route path="/space" element={<Space />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/:id/edit" element={<EditProfile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/message" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-brand" element={<NewBrand />} />
          <Route path="/brand/:brand-id/edit" element={<EditBrand />} />
          <Route path="/new-event" element={<NewEvent />} />
          <Route path='/event/:event-id/edit' element={<EditEvent />} />
          <Route path="/new-space" element={<NewSpace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
