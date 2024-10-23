import { Navigate, Route, Routes } from "react-router-dom";
import { Header, AuthBox, DashboardLayout } from "./layout";
import {
  Activity,
  Brand,
  Calendar,
  Event,
  Message,
  Profile,
  Settings,
  Space,
} from "./pages";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={"/auth?type=login"} />} />
        <Route path="/auth" element={<AuthBox />} />
        <Route path="*" element={<Navigate to={"/auth?type=login"} />} />

        <Route element={<DashboardLayout />}>
          <Route path="/activity" element={<Activity />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/event" element={<Event />} />
          <Route path="/space" element={<Space />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/message" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
