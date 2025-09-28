//IMPORTS - Hooks
//IMPORTS - Components 
import Input from "../UI/Input"
import Bttn from "../UI/Bttn"
//IMPORTS - Styles
import styles from "../UI/SignUpForm.module.css"
import { UserAccountContext } from "../Contexts/UserAccountContext"
import { useContext } from "react"

function LogInForm({ type, onSubmit}) {

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
            <Bttn type= {type} onClick= {userAccountCtx.stopLoggingIn}>Sign In</Bttn>
        </div>
    </form>

  )
}
export default LogInForm
