//IMPORTS - Hooks
import { useContext } from "react"
//IMPORTS - Components 
import{ UserAccountContext} from "../../components/Contexts/UserAccountContext"

//IMPORTS - Styles
//import styles from "./UserPage.module.css"


function Requests () {

const userAcct = useContext(UserAccountContext)

  return (
    <>
        <h1>Friend Requests</h1>
        
    </>
  )
}
export default Requests 
