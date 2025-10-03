//IMPORTS - Hooks
import { NavLink } from "react-router-dom"
//IMPORTS - Redux Tool Kit / Slices 
import { useDispatch, useSelector } from "react-redux"
import {authActions} from "../../store/slices/authSlice"

//IMPORTS - Components 
import Bttn from "./Bttn"

//IMPORTS - Styles
import styles from "./MainNav.module.css"
import SignUp from "./Signup"
import Login from "../LoginLogOut/Login"

//This tells React to evaluate the JavaScript expression inside the ${} and place the value of id into the path.
//to={`/userPage/${id}`
function MainNav() {

//DispatchActions and Functions
const dispatch = useDispatch();

const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
const id = useSelector((state) => state.auth.user?.uid)

function toggleLogIn() {
    dispatch(authActions.startLoggingIn())
}   

function toggleLogOut(){
    dispatch(authActions.logOut())
}

function toggleCreateAccount(){
    dispatch(authActions.startCreatingAccount())
}
  return (
    <header className={styles.mainWrapper}>
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <li>
                    <NavLink to="/"><img width = "30px" src="/BingeLog/HomeIcon.png"/></NavLink><br/>
                  
                </li>
                <li>
                    {!isLoggedIn && <Bttn onClick ={toggleLogIn}><img width = "30px" src="/BingeLog/LogIn.png"/></Bttn>}
                </li>
                 <li>
                    {!isLoggedIn && <Bttn onClick = {toggleCreateAccount}>Create Account</Bttn>}
                </li>
                <li>
                    {isLoggedIn && <NavLink to="/bingelog"><img width = "30px" src="/BingeLog/BingeLog.png"/></NavLink>}
                </li>
                 <li>
                    {isLoggedIn && id && (<NavLink to={`/userPage/${id}`}><img width="30px" src="/BingeLog/UserPage.png" /></NavLink>)}
                  
                </li>
                 <li>
                    {isLoggedIn &&<NavLink to="/shows"><img width= "30px" src= "/BingeLog/TvIcon.png"/></NavLink>}
                </li>
                 <li>
                    {isLoggedIn &&<NavLink to="/userSearch"><img width= "30px" src= "/BingeLog/UserSearchIcon.png"/></NavLink>}
                </li>
                 <li>
                    {isLoggedIn && <Bttn onClick = {toggleLogOut}><img width = "30px" src="/BingeLog/LogOut.png"/></Bttn>}
                </li>
            </ul>  
            <SignUp/>
            <Login/>
        </nav>
    </header>
    
  )
}
export default MainNav