import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { useEffect } from 'react';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useVerifyTokenQuery } from './services/auth';
import { useSelector } from 'react-redux';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const { user } = useSelector((state) => state?.auth);


  const { data, isLoading, isError, isFetching } = useVerifyTokenQuery(undefined, { skip: !!user });

  useEffect(() => {
    if (!token) {

      window.localStorage.removeItem("token");
      if (pathname !== "/auth") {
        navigate("/auth?type=login");
      }
    } else if (pathname === "/auth") {

      navigate("/activity");
    }
  }, [token, pathname, navigate]);

  useEffect(() => {
    if (isError) {

      window.localStorage.removeItem("token");
      navigate("/auth?type=login");
    }
  }, [isError, navigate]);

  return (
    <>
      <Header isLogin={!!token} />
      <Routes>
        <Route path="/" element={<Navigate to={"/auth?type=login"} />} />
        <Route path="/auth" element={<AuthBox />} />
        <Route path="*" element={<Navigate to={"/auth?type=login"} />} />

        <Route element={<DashboardLayout isTokenChecking={isLoading || isFetching} />}>
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
