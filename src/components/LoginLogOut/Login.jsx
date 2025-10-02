//IMPORTS - Hooks
import {useContext} from "react"
//IMPORTS - Components 
import LogInForm from "./LogInForm"
import Modal from "../UI/Modal"
import { UserAccountContext } from "../Contexts/UserAccountContext"
//IMPORTS - Redux Features 
import { useSelector, useDispatch } from "react-redux"
import { authActions } from "../../store/slices/authSlice"


//IMPORTS - Styles
    //import styles from FILE LOCATION

function Login() {
const dispatch = useDispatch();
const openModal = useSelector((state) => state.auth.isLoggingIn)


function handleSubmitLoginInfo(user){
    dispatch (authActions.login(user))
}

function handleClose() {
    dispatch(authActions.stopLoggingIn())
}

async function verifyLogin(userData){
    const url = `http://localhost:3000/users?userName=${userData.userName}`;
    const response = await fetch(url);
    const users = await response.json();
     //Check if the user was found in the database (the array is not empty)
    const user = users[0];
   
    // Check if the user exists and the password matches
    if (user && user.password === userData.password) {
        localStorage.setItem("token", user.id); // setting a fake "token"
        const loginInfo = {
            id: user.id,
            userName: user.userName,
            email:user.email
        }
        handleSubmitLoginInfo(loginInfo);
        console.log(user)
        console.log(loginInfo)
        return
    } else {
        console.log("Login failed: Invalid username or password.");
        return null
    }
}


function handleLogin(event){
    event.preventDefault()
    const formData = new FormData(event.target)
    const userData = {
        userName: formData.get("username"),  
        password: formData.get("password"),  
    };
    
    verifyLogin(userData) 
}

return (
    <>  
        <Modal 
            open = {openModal}  
            onClose={handleClose}>
            <LogInForm
                onSubmit = {handleLogin}
                type = "submit"
            />
        </Modal>

    </>
  )
}
export default Login
