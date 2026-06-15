//IMPORTS - Hooks
import { NavLink } from "react-router-dom"
//IMPORTS - Components 
import TextContent from "../../components/UI/TextContent"
import  Auth  from "../../components/auth"
import SignUp from "../../components/UI/Signup"
import Login from "../../components/LoginLogOut/Login"
//IMPORTS - Styles
import styles from "./HomePage.module.css"
import Bttn from "../../components/UI/Bttn"

import { useDispatch } from "react-redux"
import { authActions } from "../../store/slices/authSlice"

const LandingPage = () =>  {
    const dispatch = useDispatch();
  
  function toggleCreateAccount(){
      dispatch(authActions.startCreatingAccount())
  }

    function toggleLogIn() {
        dispatch(authActions.startLoggingIn())
    } 
    return (
    <main className={styles.mainWrapper}>
      <header className={styles.title}>
        <p>BingeLog</p> 
        <h2>What's on your list?</h2> 
      </header>
      <section className={styles.ctaWrapper}>
         <div className={styles.cta1}>
                <h2><span>Track</span> your shows</h2>
			    <p>
				    Find and track all your favorite shows to tossing to a bingeing list, 
            finished list, or track which episodes you have finished!
			    </p>
			    </div>
			    <div className={styles.cta2}>
                <h2><span>Remember</span> your shows.</h2>
				  <p>
						Binging a show blurs the plot. 
            Each episode allows you to write notes to refer back to. 
				  </p>
			  </div>
			  <div className={styles.cta3}>
                <h2><span>Chat</span> about your shows.</h2>
				  <p>
					   Everytime you update a shows status, status generates for friends to see where you are to avoid accidental spoilers discussion.
				  </p>
        </div>
        <NavLink to="/About" className={styles.learnMoreLink}><h2>Click here to learn more</h2></NavLink>
        </section>
        <section className = {styles.loginSignUp}>
            <p>Create an account</p>
            <SignUp/>
            <Bttn onClick ={toggleLogIn}>Or Login Here</Bttn>
            <Login/>
        </section>
    </main>
  )
} 
export default LandingPage