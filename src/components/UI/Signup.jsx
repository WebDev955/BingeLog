//IMPORTS - Hooks
import { useState } from "react";
//IMPORTS - Components
import SignUpForm from "./SignUpForm";
//IMPORTS - Redux
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slices/authSlice";
import { db, auth, setDoc, doc } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

//IMPORTS - Styles
//import styles from FILE LOCATION

function SignUp() {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmitAccountInfoFireBase(newUserData) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password,
      );

      const uid = userCredentials.user.uid;

      const docRef = doc(db, "Users", uid);
      await setDoc(docRef, {
        email: newUserData.email,
        userName: newUserData.userName,
        bio: "",
        bioAvatar: null,
        friendsList: [],
        myShows: [],
        epNotes: [],
        charNotes: [],
        currentlyBinging: [],
        watchedEps: [],
        finishedShows: [],
        reviews: [],
      });

      dispatch(
        authActions.login({
          uid,
          email: newUserData.email,
          userName: newUserData.userName,
        }),
      );
      dispatch(authActions.stopCreatingAccount());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const userName = formData.get("username");
    const password = formData.get("password");

    const newUserData = {
      email,
      userName,
      password,
    };
    handleSubmitAccountInfoFireBase(newUserData);
    //accountCtx.createNewUser(newUserData)
  }
  return (
    <>
      <SignUpForm onSubmit={handleSubmit} type="submit" disabled={isSubmitting} />
    </>
  );
}
export default SignUp;
