import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { success, error } from "../../assets";
import "./Verification.css";

const Verification = () => {
  const navigate = useNavigate();
  const { id, newEmail_token, verify_token } = useParams();
  const [Error, setError] = useState(null);
  const [validUrl, setValidUrl] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        let res;
        if (newEmail_token) {
          res = await fetch(`/api/auth/verifyNewEmail/${id}/${newEmail_token}`);
        } else if (verify_token) {
          res = await fetch(`/api/auth/verify/${id}/${verify_token}`);
        } else {
          setError("Invalid request");
          return;
        }

        const data = await res.json();
        if (data.success === false) {
          setValidUrl(false);
          setError(data.message);
        } else {
          setValidUrl(true);
        }
      } catch (error) {
        setError("Invalid request");
        setValidUrl(false);
      }
    };

    verify();
  }, [id, newEmail_token, verify_token]);

  const handleRedirect = (e) => {
    e.preventDefault();
    navigate("/signin", { replace: true });
  };

  return (
    <section id="verSecHolder">
      {validUrl ? (
        <div id="verSuccess">
          <h1>SUCCESS</h1>
          <img src={success} alt="SUCCESS" />
          <button onClick={handleRedirect} className="button">
            Continue
          </button>
        </div>
      ) : (
        <div id="verFail">
          <h1>ERROR</h1>
          <img src={error} alt="ERROR" />
          <div>Reason: {Error}</div>
        </div>
      )}
    </section>
  );
};

export default Verification;
