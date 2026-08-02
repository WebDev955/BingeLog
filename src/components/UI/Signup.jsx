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
  // Use null (not "") for "no error" so it matches what validateUserData/setErrors write below.
  const [errors, setErrors] = useState({
    email: null,
    password: null,
    passwordMatch: null,
    userName: null,
    form: null, // for errors that aren't tied to one specific field (e.g. network failure)
  })

  //REGEX CHECKS
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


 const validateUserData = (newUserData) => {
    const doesPasswordMatch = newUserData.password === newUserData.passwordConf
    const isUserNameValid = usernameRegex.test(newUserData.userName)
    const isPasswordValid = passwordRegex.test(newUserData.password)
    const isEmailValid = emailRegex.test(newUserData.email)

    // Build the result as a plain local object instead of reading the `errors`
    // state back afterward — setErrors doesn't apply synchronously, so reading
    // `errors` right after calling it would still return the previous render's
    // (stale) values. Returning this local object gives the caller an accurate,
    // up-to-date result to branch on immediately.
    // `form` is reset to null here too, so a stale general error from a
    // previous failed attempt doesn't linger once the user tries again.
    const validationErrors = {
      userName: !isUserNameValid
        ? "User name must be between 3-20 characters and only contain letters, digits and underscores"
        : null,
      email: !isEmailValid ? "Please enter a valid email address." : null,
      passwordMatch: !doesPasswordMatch ? "Passwords do not match." : null,
      password: !isPasswordValid
        ? "Passwords must be at least 8 characters containing at least 1 uppercase letter, 1 lowercase letter, a digit, and at least one non-alphanumeric symbol."
        : null,
      form: null,
    }

    setErrors(prev => ({ ...prev, ...validationErrors }))
    return validationErrors
  }
   
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
      console.error(err)
      // Map Firebase's error code to the field it actually concerns, instead
      // of always labeling every failure as an email-format problem.
      switch (err.code) {
        case "auth/invalid-email":
          setErrors(prev => ({ ...prev, email: "Please enter a valid email address." }))
          break
        case "auth/email-already-in-use":
          setErrors(prev => ({ ...prev, email: "An account with this email already exists." }))
          break
        case "auth/weak-password":
          setErrors(prev => ({ ...prev, password: "Password is too weak. Must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 digit, and at least one symbol." }))
          break
        default:
          setErrors(prev => ({ ...prev, form: "Something went wrong. Please try again." }))
      }
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
    const passwordConf = formData.get("confirmpassword")

    const newUserData = {
      email,
      userName,
      password,
      passwordConf
    };

    // Capture the freshly computed errors and bail out before hitting Firebase
    // if any client-side check failed. (Checking the `errors` state variable
    // directly here was always truthy, since it's an object regardless of
    // its contents — that let every submit through before.)
    const validationErrors = validateUserData(newUserData)
    const hasErrors = Object.values(validationErrors).some(Boolean)
    if (hasErrors) return

    handleSubmitAccountInfoFireBase(newUserData);
  }

  return (
    <>
      <SignUpForm 
        onSubmit={handleSubmit}
        type="submit" 
        disabled={isSubmitting} 
        errors = {errors}
        />
    </>
  );
}
export default SignUp;
