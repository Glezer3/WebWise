import { useState, useEffect, useRef, } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../../redux/userSlicer/userSlice";
import { StarsCanvas } from "../canvas";
import { eye, crossed_eye } from "../../assets";
import { SectionWrapper } from "../../HighOrderComponents";
import OAuth from "../OAuth/OAuth";
import "./SignIn.css";


const SignIn = () => {
    const [ icon, setIcon ] = useState('hidden');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ Error, setError ] = useState(null);
    const [Loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const activeIcon = 'hidden';

    const [form, setForm] = useState({
        email: "",
        password: "",
      });
    
    const formRef = useRef();
    const timerRef = useRef();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(signInStart());
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(signInFailure(data.message));
          if(data.message.includes("email")) setError("The verification email was sent - ");
          else if(data.message.includes("User")) setError("User not found ");
          else if(data.message.includes("Wrong")) setError("Wrong credentials ");
          else setError(data.message );
          return;
        }
        dispatch(signInSuccess(data));
        navigate('/');
      } 
        catch (error) {
        dispatch(signInFailure(error.message));
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
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleUser = (e) => {
        if (!/[a-zA-Z0-9-@._#]/.test(e.key)) e.preventDefault();
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
      )

      const getPasswordStyle = (inputName) => (
        form[inputName] ? { top: "-18%" } : {}
      );

    const handleResend = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('/api/auth/signin?resend=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message)
          return;
        }

        setLoading(true);
        setResendTimer(30);
        setError("The email has been resent - ");

      } 
        catch (error) {
        setError(error);
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

    return (
        <div id="signInHolder">
            <div id="signInShape">
                <p id="headSubtext">WELCOME BACK</p>
                <h1 id="headTitle">Sign in</h1>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    method="POST"
                    autoComplete="on"
                    id="form"
                    style={loading ? {pointerEvents: "none"} : {pointerEvents: "all"}}
                >
            <span className="userInput" id="holderUsername">
              <input
                name="email"
                type="text"
                id="email"
                minLength="5"
                maxLength="50"
                autoComplete="email"
                value={form.email}
                onKeyDown={(e) => handleUser(e)}
                onChange={handleLabelPosition}
                readOnly={loading ? true : false}
                required
              />
              <label htmlFor="email" style={getLabelStyle('email')}>Username/E-mail</label>
              <div className="underline"></div>
            </span>

            <span className="userInput" id="holderPassword">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                maxLength="30"
                autoComplete="current-password"
                value={form.password}
                onKeyDown={(e) => handlePassword(e)}
                onChange={handleLabelPosition}
                readOnly={loading ? true : false}
                required
              />
              <label htmlFor="password" style={getPasswordStyle('password')}>Password</label>
              <div className="underline"></div>
              <div id="seePassword"><img onClick={() => { toggleIcon(); togglePasswordVisibility(); }} src={icon === 'hidden' ? eye : crossed_eye} alt={icon === 'hidden' ? 'eye' : 'crossed_eye'} style={loading ? {pointerEvents: "none"} : {pointerEvents: "all"}} /></div>
              <div id="forgotPassword"><a style={loading ? {pointerEvents: "none"} : {pointerEvents: "all"}} href="forgot_password">Forgot Password?</a></div>
            </span>
              <div id="errorHolder">
                {Error && (
                  <div>{Error}<button
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
                )}
              </div>
              <button type="submit" className="button" id="accountButton" style={loading ? {pointerEvents: "none"} : {pointerEvents: "all"}}>{loading ? 'Signing in' : 'Sign in'}</button>
              <OAuth/>
              <div id="noAccount"><p>Don&apos;t have account?&nbsp;<a style={loading ? {pointerEvents: "none"} : {pointerEvents: "all"}} href="signup">Sign up</a>&nbsp;now!</p></div>
            </form>
            </div>
            <StarsCanvas />
        </div>
    )
}

export default SectionWrapper(SignIn, "signin")