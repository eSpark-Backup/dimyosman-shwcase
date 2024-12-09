import { LinearProgress } from "@mui/material";
import { logoIcon, logoText } from "../assets";

const SplashScreen = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#EEE",
        color: "white",
        fontSize: "24px",
        fontWeight: "bold",
        zIndex: 99999,
        gap: "50px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img width={42} height={42} src={logoIcon} alt="Icon" />
        <img
          className="text-icon"
          src={logoText}
          alt="Icon"
          style={{ height: "22px" }}
        />
      </div>
      <LinearProgress sx={{ width: "220px" }} />
    </div>
  );
};

export default SplashScreen;
