import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
  ForgotPassword,
  ResetPassword,
} from "./pages";
import SharedPage from './pages/sharedUrl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useVerifyTokenQuery } from './services/auth';
// import Search from './pages/dashboard/search';
import { useAuth0 } from '@auth0/auth0-react';
import { logoutAuthUtils } from './utils';
import SplashScreen from './layout/splash';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");

  const { isLoading, isError, isFetching } = useVerifyTokenQuery(undefined, { skip: !token });
  const { logout } = useAuth0();

  useEffect(() => {
    if (!token) {

      window.localStorage.removeItem("token");
      if (pathname !== "/auth" && pathname !== "/forgot-password" && pathname !== "/reset-password" && pathname !== "/share") {
        logoutAuthUtils(logout)
        navigate("/auth?type=login");
      }
    } else if (pathname === "/auth") {

      navigate("/activity");
    }
  }, [token, pathname, navigate]);

  useEffect(() => {
    if (isError) {

      window.localStorage.removeItem("token");
      logoutAuthUtils(logout)
      navigate("/auth?type=login");
    }
  }, [isError, navigate]);

  if (isLoading || isFetching) {
    return <SplashScreen />;
  }

  const PublicRoute = () => {
    if (token) {
      return <Navigate to="/activity" />;
    }
    return <Outlet />;
  };

  return (
    <>
      <Header isLogin={!!token} />
      <Routes>
          <Route path="/share" element={<SharedPage />} />
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to={"/auth?type=login"} />} />
          <Route path="/auth" element={<AuthBox />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to={"/auth?type=login"} />} />
        </Route>

        <Route element={<DashboardLayout isTokenChecking={isLoading || isFetching} />}>
          <Route path="/activity" element={<Activity />} />
          {/* BRANDS */}
          <Route path="/my-brands" element={<Brand />} />
          <Route path="/brand/:name" element={<BrandDetails />} />
          <Route path="/my-brands/:name" element={<BrandDetails />} />
          <Route path="/new-brand" element={<NewBrand />} />
          <Route path="/my-brands/:name/edit" element={<EditBrand />} />
          {/* {EVENTS} */}
          <Route path="/my-events" element={<Event />} />
          <Route path="/my-events/:name" element={<EventDetails />} />
          <Route path="/event/:name" element={<EventDetails />} />
          <Route path="/new-event" element={<NewEvent />} />
          <Route path="/my-events/:name/edit" element={<EditEvent />} />
          {/* SPACES */}
          <Route path="/my-spaces" element={<Space />} />
          <Route path="/space/:name" element={<SpaceDetails />} />
          <Route path="/my-spaces/:name" element={<SpaceDetails />} />
          <Route path="/new-space" element={<NewSpace />} />
          <Route path="/my-spaces/:name/edit" element={<EditSpace />} />
          {/* OTHERS */}
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/:id/edit" element={<EditProfile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/message" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/search" element={<Search />} /> */}
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
