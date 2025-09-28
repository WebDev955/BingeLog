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
const closeModal = useSelector((state) => state.auth.isCreatingAccount)

function handleSubmitAccountInfo(){
    dispatch(authActions.user)
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
        <Modal open = {openModal} onClose={closeModal}>
            <SignUpForm
                onSubmit = {handleSubmit}
                type = "submit"
            />
        </Modal>

    </>
  )
}
export default SignUp
