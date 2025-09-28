//IMPORTS - Components 
import FeedCard from "./FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPage.module.css"

//IMPORTS - Hooks
import { useContext, useEffect, useState } from "react"

//IMPORTS - Components 
import{ UserAccountContext} from "../../components/Contexts/UserAccountContext"
import { useSelector, useDispatch } from "react-redux"
import { friendsActions } from "../../store/slices/friendsSlice"

/* HOW THIS PAGE SHOULD NORMALLY WORK
    userCtx.friendsList.map((friend) => {
      <FeedCard/>
    }))
 
*/

function BingeLog() {

  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then (res => res.json())
      .then (data => setGlobalUsers(data))
  },[])


  return (
    <main className = {styles.mainWrapper}>
      <h1>BingeLog Feed</h1>
      {friendsList?.map((friendId) => {  
        const friend = globalUsers.find(friend => friend.id === friendId);  
        if (!friend) return null
        return <FeedCard key={friend.id} friend = {friend}/>
      })}
      </main>
  ) 
}
export default BingeLog
