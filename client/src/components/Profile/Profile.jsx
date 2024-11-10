import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/userSlicer/userSlice";
import { useDispatch } from "react-redux";
import { app } from "../../firebase";
import { SectionWrapper } from "../../HighOrderComponents";
import { eye, crossed_eye } from "../../assets";
import { StarsCanvas } from "../canvas";
import "./Profile.css";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [icon, setIcon] = useState("hidden");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModule, setShowConfirmModule] = useState(false);
  const [showDeleteModule, setShowDeleteModule] = useState(false);
  const [showSignOutModule, setShowSignOutModule] = useState(false);
  const [showUpdateModule, setShowUpdateModule] = useState(false);
  const [Error, setError] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [progressPerc, setProgressPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
            email: '',
            username: '',
            avatar: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [doUpdate, setDoUpdate] = useState(false);

  const toggleIcon = () => {
    setIcon(icon === "hidden" ? "visible" : "hidden");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUpdateStart = () => {
    setDoUpdate((prev) => !prev);
  };

  const handleShowConfirmModule = () => {
    setShowConfirmModule((prev) => !prev);
  };

  const handleShowDeleteModule = () => {
    setShowDeleteModule((prev) => !prev);
    handleShowConfirmModule();
  };

  const handleShowSignOutModule = () => {
    setShowSignOutModule((prev) => !prev);
    handleShowConfirmModule();
  };

  const handleShowUpdateModule = () => {
    setShowUpdateModule((prev) => !prev);
    handleShowConfirmModule();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/user/profile`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser._id }),
        });
        const data = await res.json();
        if (data.success) {
          setFormData({
            email: data.user.email,
            username: data.user.username,
            avatar: data.user.avatar,
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };
  
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressPerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleShowUpdateModule();

    if (formData.email && formData.email !== currentUser.email) {
      try {
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || "Failed to send verification email.");
          return;
        }
  
        setError("Verify your new email before you can use it");
      } catch (error) {
        setError("An error occurred while sending the verification email.");
        return;
      }
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));

        if (data.message.includes("username")) {
          setError("This username already exists");
        } else if (data.message.includes("verification")) {
          setError("The verification email sent. Please verify your new email first.");
        } else if (data.message.includes("verify")) {
          setError("Please verify your new email before changes are applied.");
        } else {
          console.log(data.message)
          setError("An error occurred");
        }

        return;
      }

      handleUpdateStart();
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
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

  return (
    <section id="signInHolder">
      <div id="signInShape">
        <p id="headSubtext">UPDATE</p>
        <h1 id="headTitle">Profile</h1>

        <form
          onSubmit={handleSubmit}
          id={doUpdate ? "profileForm" : "profileFormActive"}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileRef}
            accept="image/*"
            style={{ display: "none" }}
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
          />
          <p className="imgUploadInfo">
            {fileUploadError ? (
              <span className="text-red-700 mb-5">
                Error Image upload (image must be less than 5 mb)
              </span>
            ) : progressPerc > 0 && progressPerc < 100 ? (
              <span className="imgUploadInfo">{`Uploading ${progressPerc}%`}</span>
            ) : progressPerc === 100 ? (
              <span className="text-green-700 mb-5">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <span className="userInput" id="holderUsername">
            <input
              name="username"
              type="text"
              id="username"
              minLength="5"
              maxLength="35"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={(e) => handleUser(e)}
              required
            />
            <div className="underline"></div>
          </span>

          <span className="userInput" id="holderEmail">
            <input
              name="email"
              type="email"
              id="email"
              minLength="10"
              maxLength="50"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={(e) => handleEmail(e)}
              required
            />
            <div className="underline"></div>
          </span>

          <span className="userInput" id="holderPassword">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              minLength="8"
              maxLength="30"
              defaultValue={"**********"}
              onChange={handleChange}
              onKeyDown={(e) => handlePassword(e)}
              required
            />
            <div id="seePassword">
              <img
                onClick={() => {
                  toggleIcon();
                  togglePasswordVisibility();
                }}
                src={icon === "hidden" ? eye : crossed_eye}
                alt={icon === "hidden" ? "eye" : "crossed_eye"}
                style={
                  loading
                    ? { pointerEvents: "none" }
                    : doUpdate
                    ? { pointerEvents: "all" }
                    : { pointerEvents: "none" }
                }
              />
            </div>
            <div className="underline"></div>
          </span>
          <div
            id="confirmChangeHolder"
            style={
              showConfirmModule ? { display: "block" } : { display: "none" }
            }
          >
            <div id="confirmChangeShape">
              <h1>
                {showSignOutModule
                  ? "Are you sure you want to Sign out?"
                  : showUpdateModule
                  ? "Are you sure you want to Confirm changes?"
                  : showDeleteModule
                  ? "Are you sure you want to Delete your account?"
                  : ""}
              </h1>
              <div id="confirmChange">
                <button
                  onClick={
                    showSignOutModule
                      ? () => {
                          handleShowSignOutModule();
                          handleSignOut();
                        }
                      : showUpdateModule
                      ? () => handleSubmit()
                      : showDeleteModule
                      ? () => {
                          handleShowDeleteModule();
                          handleDelete();
                        }
                      : undefined
                  }
                  className="button"
                  type={showUpdateModule ? "submit" : "button"}
                >
                  {showSignOutModule
                    ? "Sign out"
                    : showUpdateModule
                    ? "Confirm"
                    : showDeleteModule
                    ? "Delete"
                    : ""}
                </button>
                <span
                  onClick={
                    showSignOutModule
                      ? handleShowSignOutModule
                      : showUpdateModule
                      ? handleShowUpdateModule
                      : showDeleteModule
                      ? handleShowDeleteModule
                      : undefined
                  }
                  className="button"
                >
                  Cancel
                </span>
              </div>
            </div>
          </div>
          <div id="profileSettings">
            <span
              onClick={() => {
                handleShowDeleteModule();
              }}
              id="delAcc"
            >
              Delete account
            </span>
            <span
              onClick={() => {
                handleShowSignOutModule();
              }}
              id="signOutAcc"
            >
              Sign out
            </span>
          </div>
          <p id="errorHolder" className="mb-5">
            {error
              ? Error
              : updateSuccess
              ? "Successfully updated"
              : Error
              ? Error
              : null}
          </p>
          {doUpdate ? (
            <button
              className="button"
              type="button"
              onClick={() => {
                handleShowUpdateModule();
              }}
            >
              Confirm
            </button>
          ) : (
            <button
              className="button"
              type="button"
              onClick={() => {
                handleUpdateStart();
              }}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          )}
        </form>
      </div>
      <StarsCanvas />
    </section>
  );
};

export default SectionWrapper(Profile, "profile");
