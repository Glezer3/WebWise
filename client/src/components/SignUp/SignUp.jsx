import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { StarsCanvas } from "../canvas";
import { eye, crossed_eye } from "../../assets";
import { SectionWrapper } from "../../HighOrderComponents";
import OAuth from "../OAuth/OAuth";
import "./SignUp.css";

const SignUp = () => {
    const [ icon, setIcon ] = useState('hidden');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ waititng, setWaiting ] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const activeIcon = 'hidden';

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
      });
    
    const formRef = useRef();

    const handleSubmit = async (e) => {
      e.preventDefault();
    try {
      setWaiting(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success === false) {
        setWaiting(false);
        if (data.message.includes("username")) {
          setError("This username already exists");
        } else if (data.message.includes("email")) {
          setError("This email is already in use");
        } else {
          setError("An error occurred");
        }
        return;
      }
      setError("You have been successfully registered! Redirecting...");
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (error) {
      setWaiting(false);
      setError(error.message);
    }
  };

    useEffect(() => {
        if (activeIcon === 'hidden') setIcon('hidden');
        else setIcon('visible');
      }, [activeIcon]);

    const toggleIcon = () => {
        setIcon(icon === 'hidden' ? 'visible' : 'hidden')
    };

    const togglePasswordVisibility = () => {
        setShowPassword((ShowPassword) => !ShowPassword);
    };

    const handleUser = (e) => {
        if (!/[a-zA-Z0-9-#_.]/.test(e.key)) e.preventDefault();
    };
    
    const handleEmail = (e) => {
        if (!/[a-zA-Z0-9-@._]/.test(e.key)) e.preventDefault();
    };

    const handlePassword = (e) => {
        if (!/[a-zA-Z0-9-!@#$%&,_.?]/.test(e.key)) e.preventDefault();
    };

    const handleLabelPosition = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
    
      const getLabelStyle = (inputName) => (
        form[inputName] ? { top: "-23%" } : {}
      );

      const getPasswordStyle = (inputName) => (
        form[inputName] ? { top: "-18%" } : {}
      );

    const [isMobile, setIsMobile] = useState(false);

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

    const getLabelStyleMobile = (inputName) => (
      form[inputName] ? { top: "-21.5%", color: "#FF6666" } : {}
    );

    const getPasswordStyleMobile = (inputName) => (
      form[inputName] ? { top: "-13%", color: "#FF6666" } : {}
    );

    return (
        <div id="signInHolder">
            <div id="signInShape">
                <p id="headSubtext">LET&apos;S BEGIN</p>
                <h1 id="headTitle">Sign up</h1>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    method="POST"
                    autoComplete="on"
                    id="form"
                    style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}}
                >
            <span className="userInput" id="holderAccName">
              <input
                name="username"
                type="text"
                id="username"
                minLength="5"
                maxLength="35"
                autoComplete="given-name"
                value={form.username}
                onKeyDown={(e) => handleUser(e)}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="username" style={isMobile ? getLabelStyleMobile('username') : getLabelStyle('username')}>Username</label>
              <div className="underline"></div>
            </span>

            <span className="userInput" id="holderAccUsername">
              <input
                name="email"
                type="email"
                id="email"
                minLength="10"
                maxLength="50"
                autoComplete="email"
                value={form.email}
                onKeyDown={(e) => handleEmail(e)}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="email" style={isMobile ? getLabelStyleMobile('email') : getLabelStyle('email')}>E-mail</label>
              <div className="underline"></div>
            </span>

            <span className="userInput" id="holderAccPassword">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                minLength="8"
                maxLength="30"
                autoComplete="new-password"
                value={form.password}
                onKeyDown={(e) => handlePassword(e)}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="password" style={isMobile ? getPasswordStyleMobile('password') : getPasswordStyle('password')}>Password</label>
              <div className="underline"></div>
              <div id="seePassword"><img onClick={() => { toggleIcon(); togglePasswordVisibility(); }} src={icon === 'hidden' ? eye : crossed_eye} alt={icon === 'hidden' ? 'eye' : 'crossed_eye'} style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}} /></div>
              <div id="TaC"><input type="checkbox" required/>&nbsp;I have read and agree to the&nbsp;<a style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}} href="terms-of-service">terms of service</a></div>
            </span>
            <div id="errorHolder">{error}</div>
              <button type="submit" className="button" id="createAccountButton" style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}}>{waititng ? 'Signing up' : 'Sign up'}</button>
              <OAuth/>
              <div id="noAccount"><p>Already have an account?&nbsp;<a style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}} href="signin">Sign in</a>&nbsp;now!</p></div>
            </form>
            </div>
            <StarsCanvas />
        </div>
    )
}

export default SectionWrapper(SignUp, "signup")