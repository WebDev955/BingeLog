//IMPORTS - Hooks
//IMPORTS - Components 
import Input from "./Input"
import Bttn from "./Bttn"
//IMPORTS - Styles
import styles from "./SignUpForm.module.css"
import { UserAccountContext } from "../Contexts/UserAccountContext"
import { useContext } from "react"

function SignUpForm({ type, onSubmit}) {

    const userAccountCtx = useContext(UserAccountContext)

  return (
    <form onSubmit={onSubmit} className = {styles.formWrapper}> 
        <div className={styles.inputWrapper}>
            <Input
                label= "User Name"
                htmlFor = "username"
                id= "username"
                name = "username"
            />
             <Input
                label= "Password"
                htmlFor = "password"
                id= "password"
                name = "password"
            />
            <Input
                label= "Email"
                htmlFor = "email"
                id= "email"
                name = "email"
            />
            <Bttn type= {type} onClick= {userAccountCtx.stopCreatingAccount}>Sign Up</Bttn>
        </div>
    </form>

  )
}
export default SignUpForm
