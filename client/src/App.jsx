import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Navbar,
  Default,
  Home,
  About,
  Contact,
  SignUp,
  Verification,
  SignIn,
  ForgotPassword,
  ResetPassword,
  TermsOfService,
  Profile,
  Sensors,
  AddSensor,
  Sensor,
  Unknown,
} from "./components";
import PrivateRoute, { LoggedIn } from "./components/PrivateRouter";
import AccessRoute from "./components/AccessRoute";
import "./styles.css";

const App = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hideNavbarOnPages = [
      "/forgot-password",
      "/reset-password",
      "/terms-of-service",
      "",
    ];

    const currentPage = window.location.pathname;

    const handlePageLoading = () => {
      document.body.classList.add("loading");
      setTimeout(() => {
        document.body.classList.remove("loading");
      }, 500);
    };

    hideNavbarOnPages.includes(currentPage)
      ? setShowNavbar(false)
      : window.location.pathname.includes("/reset-password") ||
        window.location.pathname.includes("/verify")
      ? setShowNavbar(false)
      : setShowNavbar(true);

    setIsLoading(false);

    window.addEventListener("beforeunload", handlePageLoading);

    return () => {
      window.removeEventListener("beforeunload", handlePageLoading);
    };
  }, []);

  return (
    <BrowserRouter>
      {!isLoading && showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route element={<LoggedIn />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify/:id/:verify_token" element={<Verification />} />
          <Route path="forgot_password" element={<ForgotPassword />} />
          <Route
            path="reset-password/:id/:reset_token"
            element={<ResetPassword />}
          />
        </Route>
        <Route path="verifyNewEmail/:id/:newEmail_token" element={<Verification />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route element={<AccessRoute />}>
            <Route path="sensors/:id" element={<Sensors />} />
            <Route path="sensors/add_sensor/:id" element={<AddSensor />} />
            <Route path="sensors/:id/:sensorID" element={<Sensor />} />
          </Route>
        </Route>
        <Route path="*" element={<Unknown />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
