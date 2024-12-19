import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import { Header, AuthBox, DashboardLayout } from "./layout";
import {
  Activity,
  Brand,
  BrandDetails,
  Calendar,
  EditBrand,
  EditEvent,
  EditProfile,
  EditSpace,
  Event,
  EventDetails,
  Message,
  NewBrand,
  NewEvent,
  NewSpace,
  Profile,
  Settings,
  Space,
  SpaceDetails,
} from "./pages";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

function App() {
  const { pathname } = useLocation();
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      return decodedToken.exp < now;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If decoding fails, treat as expired
    }
  }

  useEffect(() => {
    const tokenExpired = isTokenExpired(token);

    if (token && !tokenExpired && pathname === "/auth") {
      navigate("/activity");
    }
    if (!token || tokenExpired) {
      window.localStorage.removeItem("token");
      if (pathname !== "/auth") {
        navigate("/auth?type=login");
      }
    }
  }, [token, pathname, navigate]);

  return (
    <>
      <Header isLogin={token} />
      <Routes>
        <Route path="/" element={<Navigate to={"/auth?type=login"} />} />
        <Route path="/auth" element={<AuthBox />} />
        <Route path="*" element={<Navigate to={"/auth?type=login"} />} />

        <Route element={<DashboardLayout />}>
          <Route path="/activity" element={<Activity />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/brand/:id" element={<BrandDetails />} />
          <Route path="/event" element={<Event />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/space/:id" element={<SpaceDetails />} />
          <Route path="/space" element={<Space />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/:id/edit" element={<EditProfile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/message" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-brand" element={<NewBrand />} />
          <Route path="/brand/:brandId/edit" element={<EditBrand />} />
          <Route path="/new-event" element={<NewEvent />} />
          <Route path="/new-space" element={<NewSpace />} />
          <Route path="/space/:spaceId/edit" element={<EditSpace />} />
          <Route path="/event/:eventId/edit" element={<EditEvent />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition:Bounce
      />
    </>
  );
}

export default App;
