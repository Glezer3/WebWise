import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { signInSuccess } from "../../redux/userSlicer/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import "./OAuth.css";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const resultGoogle = await signInWithPopup(auth, provider); 

            if(resultGoogle.user) {
            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: resultGoogle.user.displayName, email: resultGoogle.user.email, photo: resultGoogle.user.photoURL }),
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/')
            }

            else console.log("User not signed in with Google")

        } catch (error) {
            console.log("Could not sign in  with Google", error);
        }
    }

    return (
        <div id="oAuthHolder">
            <button type="button" onClick={handleGoogle} className="button">Continue with Google</button>
        </div>
    )
}

export default OAuth