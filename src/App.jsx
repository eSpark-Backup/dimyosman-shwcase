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
  Event,
  EventDetails,
  Message,
  NewBrand,
  NewEvent,
  Profile,
  Settings,
  Space,
  SpaceDetails,
} from "./pages";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { pathname } = useLocation();
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && pathname === "/auth") {
      navigate("/activity");
    }
    if (!token && pathname !== "/auth") {
      navigate("/auth?type=login");
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
          <Route path="/space" element={<Space />} />
          <Route path="/space/:id" element={<SpaceDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/message" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-brand" element={<NewBrand />} />
          <Route path="/brand/:brandId/edit" element={<EditBrand />} />
          <Route path="/new-event" element={<NewEvent />} />
          <Route path="/event/:event-id/edit" element={<EditEvent />} />
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
