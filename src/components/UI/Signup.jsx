//IMPORTS - Hooks

//IMPORTS - Components 
import SignUpForm from "./SignUpForm"
import Modal from "./Modal"
import { UserAccountContext } from "../Contexts/UserAccountContext"
//IMPORTS - Redux
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "../../store/slices/authSlice"
import { db, auth, setDoc, doc } from "../../firebase/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"



//IMPORTS - Styles
    //import styles from FILE LOCATION

function SignUp() {
const dispatch = useDispatch();

//const submitUserInfo = useSelector((state) => state.auth.user)
const openModal = useSelector((state) => state.auth.isCreatingAccount)
const handleCloseModal = () => dispatch(authActions.stopCreatingAccount())

  async function handleSubmitAccountInfoFireBase(newUserData){
    try {

    const userCredentials = await createUserWithEmailAndPassword(
        auth, 
        newUserData.email, 
        newUserData.password
    )

    const uid = userCredentials.user.uid
    
    const docRef = doc(db, "Users", uid)
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
            reviews:[]
        })
    
        dispatch(authActions.login({
            uid, 
            email: newUserData.email, 
            userName: newUserData.userName
        }))
        dispatch(authActions.stopCreatingAccount())

    } catch (err){
        console.error(err)
    }
  }

function handleSubmit(event){
    event.preventDefault();

    const formData = new FormData (event.target);
    const email = formData.get('email')
    const userName = formData.get('username')
    const password = formData.get('password')

    const newUserData = {
        email,
        userName,
        password
    }
    handleSubmitAccountInfoFireBase(newUserData)
    //accountCtx.createNewUser(newUserData)
}
return (
    <>  
        <Modal open = {openModal} handleClose={handleCloseModal}>
            <SignUpForm
                onSubmit = {handleSubmit}
                type = "submit"
            />
        </Modal>

    </>
  )
}
export default SignUp
