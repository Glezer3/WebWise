import { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { StarsCanvas } from "../canvas";
import { SectionWrapper } from "../../HighOrderComponents";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [form, setForm] = useState({
    email: "",
  });

  const formRef = useRef();
  const timerRef = useRef();

  const handleLabelPosition = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCAPTCHAChange = () => {

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWaiting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else {
        setError("An email was sent");
        setForm({ email: "" });
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setWaiting(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (loading || resendTimer > 0) return;

    try {
      const res = await fetch("/api/auth/forgot-password?resend=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        return;
      }

      setLoading(true);
      setResendTimer(30);
      setError("The email has been resent");

    } catch (error) {
      console.error(error);
      setError("An error occurred while resending the email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [resendTimer]);

  const handleEmail = (e) => {
    if (!/[a-zA-Z0-9-@._]/.test(e.key)) e.preventDefault();
  };

  const getLabelStyle = (inputName) => (form[inputName] ? { top: "-23%" } : {});

  return (
    <div id="forgotPasswordHolder">
      <div id="forgotPasswordShape">
        <p id="headSubtext">forgot your password?</p>
        <h1 id="headTitle">Reset Password</h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          method="POST"
          autoComplete="on"
          id="form"
        >
          <span className="userInput" id="holderUsername">
            <input
              name="email"
              type="email"
              id="email"
              minLength="10"
              maxLength="50"
              autoComplete="email"
              value={form.email}
              onKeyDown={handleEmail}
              onChange={handleLabelPosition}
              readOnly={waiting || loading}
              required
            />
            <label htmlFor="email" style={getLabelStyle("email")}>
              E-mail
            </label>
            <div className="underline"></div>
          </span>
          <div id="errorHolder">
            {error && error === "The email was already sent" || error === "The email has been resent" ? (
              <div>
                {error} -{" "}
                <button
                  onClick={handleResend}
                  id="resend"
                  style={loading || resendTimer > 0 ? { pointerEvents: "none" } : { pointerEvents: "all" }}
                  type="button"
                >
                  {resendTimer > 0
                    ? `${resendTimer}s`
                    : "resend email"}
                </button>
              </div>
            ) : error}
          </div>
          <div id="CAPTCHA">
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={handleCAPTCHAChange}
              required
            />
          </div>
          <button
            type="submit"
            className="button"
            id="forgotPasswordButton"
            style={
              waiting ? { pointerEvents: "none" } : { pointerEvents: "all" }
            }
          >
            {waiting ? "Sending Request" : "Send Request"}
          </button>
        </form>
      </div>
      <StarsCanvas />
    </div>
  );
};

export default SectionWrapper(ForgotPassword, "forgotpassword");
