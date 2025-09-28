//IMPORTS - Hooks
import {useContext} from "react"
//IMPORTS - Components 
import SignUpForm from "./SignUpForm"
import Modal from "./Modal"
import { UserAccountContext } from "../Contexts/UserAccountContext"
//IMPORTS - Redux
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "../../store/slices/authSlice"
//IMPORTS - Styles
    //import styles from FILE LOCATION

function SignUp() {
const dispatch = useDispatch();
const submitUserInfo = useSelector((state) => state.auth.user)
const openModal = useSelector((state) => state.auth.isCreatingAccount)
const handleCloseModal = () => dispatch(authActions.stopCreatingAccount(false))

async function handleSubmitAccountInfo(newUserData){
    
    try {
        const response = await fetch(`http://localhost:300/users`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: newUserData.email,
                userName: newUserData.userName,
                password: newUserData.password,
                bio: "",
                bioAvatar: null,
                friendsList: [],
                myShows: [],
                epNotes: [],
                charNotes: [],
                currentlyBinging: [],
                watchedEps: [],
                finishedShows: []
            })
        })
        if (!response.ok){
            throw new Error (`Failed to create user`)
        }
        const newUser = await response.json()
        dispatch(authActions.login(newUser))
        dispatch(authActions.stopCreatingAccount(false))
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
    handleSubmitAccountInfo(newUserData)
    //accountCtx.createNewUser(newUserData)
}
return (
    <>  
        <Modal open = {openModal} onClose={handleCloseModal}>
            <SignUpForm
                onSubmit = {handleSubmit}
                type = "submit"
            />
        </Modal>

    </>
  )
}
export default SignUp
