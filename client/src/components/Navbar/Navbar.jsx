// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/userSlicer/userSlice";
import { navLinks, account } from "../../constants";
import { logo, logo_logo } from "../../assets";
import "./Navbar.css";

const Navbar = () => {
  const [active, setActive] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirmModule, setShowConfirmModule] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser ? currentUser._id : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    setToggle(false);
  }, [location.pathname]);

  const handleShowConfirmModule = () => {
    setShowConfirmModule(!showConfirmModule);
  };

  const handleSignOut = async () => {
    handleShowConfirmModule();
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <nav>
      <div
        id="navigation"
        className={toggle ? "active_navigation" : "navigation"}
      >
        <div id="logo-menu_holder">
          <Link id="logo-menu_holder" to="/">
            <img src={isMobile ? logo_logo : logo} alt="logo" id="logo" />
          </Link>
          <div
            className={toggle ? "ham_menu_active" : "ham_menu_icon"}
            onClick={() => setToggle(!toggle)}
          >
            <span id="ham_menu_part"></span>
          </div>
        </div>
        <ul className="navigation_menu" id="menu_part">
          {currentUser
            ? navLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${
                    location.pathname === "/" + link.url + `/${id}` ||
                    location.pathname === "/" + link.url
                      ? "active_link"
                      : ""
                  }`}
                  onClick={() => {
                    setActive(link.title);
                    setToggle(false);
                  }}
                >
                  <Link
                    to={
                      link.title === "Sensors"
                        ? `${link.url}/${id}`
                        : `${link.url}`
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              ))
            : navLinks.slice(0, -1).map((link) => (
                <li
                  key={link.id}
                  className={`${
                    location.pathname === "/" + link.url + `/${id}` ||
                    location.pathname === "/" + link.url
                      ? "active_link"
                      : ""
                  }`}
                  onClick={() => {
                    setActive(link.title);
                    setToggle(false);
                  }}
                >
                  <Link to={link.url}>{link.title}</Link>
                </li>
              ))}
        </ul>

        {!currentUser ? (
          <ul className="navigation_menu" id="account_part">
            {account.map((link) => (
              <li
                id="scale"
                key={link.id}
                className={`${
                  location.pathname === "/" + `${link.url}` ? "active_link" : ""
                }`}
                onClick={() => {
                  setActive(link.title);
                  setToggle(false);
                }}
              >
                <a href={link.url} className="navigation_button">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="navigation_menu" id="account_part">
            <div id="pfpHolder">
              <a href="/profile">
                <img
                  id={`${
                    location.pathname === "/profile" ? "activepfp" : "pfp"
                  }`}
                  src={currentUser.avatar}
                  alt="pfp"
                />
              </a>
            </div>
            <li id="signOutButtonHolder">
              <a
                onClick={handleShowConfirmModule}
                id="signOutButton"
                className="navigation_button"
              >
                Sign out
              </a>
            </li>
          </ul>
        )}
      </div>
      <div
        id="confirmChangeHolderNav"
        style={showConfirmModule ? { display: "block" } : { display: "none" }}
      >
        <div id="confirmChangeShapeNav">
          <h1>Are you sure you want to sign out?</h1>
          <div id="confirmChange">
            <span onClick={handleSignOut} className="button">
              Sign out
            </span>
            <span onClick={handleShowConfirmModule} className="button">
              Cancel
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
