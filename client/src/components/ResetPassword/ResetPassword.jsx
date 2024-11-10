import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StarsCanvas } from "../canvas";
import { eye, crossed_eye } from "../../assets";
import { SectionWrapper } from "../../HighOrderComponents";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [icon, setIcon] = useState("hidden");
  const [icon2, setIcon2] = useState("hidden");
  const { id, reset_token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [waititng, setWaiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setWaiting(true);
      const res = await fetch(`/api/auth/reset-password/${id}/${reset_token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success === false) {
        setWaiting(false);
        setError(data.message);
        return;
      }

      setError(`Password successfully reset. You will be redirected in 3s`);
      setTimeout(() => {
        navigate("/signin", {replace: true});
      }, 3000);

    } catch (error) {
      setError(error);
    }
  };

  

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleLabelPosition = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const toggleIcon = () => {
    setIcon(icon === "hidden" ? "visible" : "hidden");
  };

  const toggleIcon2 = () => {
    setIcon2(icon2 === "hidden" ? "visible" : "hidden");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((ShowPassword) => !ShowPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2((ShowPassword2) => !ShowPassword2);
  };

  const getPasswordStyle = (inputName) =>
    form[inputName] ? { top: "-18%" } : {};

  const getPasswordStyleMobile = (inputName) =>
    form[inputName] ? { top: "-13%", color: "#FF6666" } : {};

  const handlePassword = (e) => {
    if (!/[a-zA-Z0-9-!@#$%&,_.?]/.test(e.key)) e.preventDefault();
  };

  return (
    <div id="signInHolder">
      <div id="forgotPasswordShape">
        <p id="headSubtext">forgot your password?</p>
        <h1 id="headTitle">Reset Password</h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          method="POST"
          autoComplete="on"
          id="form"
          style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}}
        >
          <span className="userInput" id="holderPassword">
            <input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              id="newPassword"
              minLength="8"
              maxLength="30"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleLabelPosition}
              readOnly={waititng ? true : false}
              onKeyDown={(e) => handlePassword(e)}
              required
            />
            <label
              htmlFor="newPassword"
              style={
                isMobile
                  ? getPasswordStyleMobile("newPassword")
                  : getPasswordStyle("newPassword")
              }
            >
              new password
            </label>
            <div className="underline"></div>
            <div id="seePassword">
              <img
                onClick={() => {
                  toggleIcon();
                  togglePasswordVisibility();
                }}
                src={icon === "hidden" ? eye : crossed_eye}
                alt={icon === "hidden" ? "eye" : "crossed_eye"}
                style={
                  waititng
                    ? { pointerEvents: "none" }
                    : { pointerEvents: "all" }
                }
              />
            </div>
          </span>

          <span className="userInput" id="holderPassword">
            <input
              name="confirmNewPassword"
              type={showPassword2 ? "text" : "password"}
              id="confirmNewPassword"
              minLength="8"
              maxLength="30"
              autoComplete="new-password"
              value={form.confirmNewPassword}
              onChange={handleLabelPosition}
              readOnly={waititng ? true : false}
              onKeyDown={(e) => handlePassword(e)}
              required
            />
            <label
              htmlFor="confirmNewPassword"
              style={
                isMobile
                  ? getPasswordStyleMobile("confirmNewPassword")
                  : getPasswordStyle("confirmNewPassword")
              }
            >
              Confirm new password
            </label>
            <div className="underline"></div>
            <div id="seePassword">
              <img
                onClick={() => {
                  toggleIcon2();
                  togglePasswordVisibility2();
                }}
                src={icon2 === "hidden" ? eye : crossed_eye}
                alt={icon === "hidden" ? "eye" : "crossed_eye"}
                style={
                  waititng
                    ? { pointerEvents: "none" }
                    : { pointerEvents: "all" }
                }
              />
            </div>
          </span>
          <div id="errorHolder">{error}</div>
          <button
            type="submit"
            className="button"
            id="forgotPasswordButton"
            style={
              waititng ? { pointerEvents: "none" } : { pointerEvents: "all" }
            }
          >
            {waititng ? "Reseting" : "Reset"}
          </button>
        </form>
      </div>
      <StarsCanvas />
    </div>
  );
};

export default SectionWrapper(ResetPassword, "resetpassword");
