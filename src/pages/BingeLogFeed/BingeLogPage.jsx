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

import {doc, getDoc, db } from "../../firebase/firebase"


function BingeLog() {

  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(() => {
    async function fetchGlobalUsers(){
      try {
        const docRef = doc(db, "Users", "users"); //makes a general refereneto the doc, "Users" (user ids)
        const docSnap = await getDoc(docRef) //await the call of data (user - id 234an09jfsa)
        setGlobalUsers(docSnap.data()) //set the DATA of docSnap to global users state
      } catch (err) {
        console.error ("Can't find global users", err)
      }
    }
    fetchGlobalUsers()
  },[])
  
console.log(globalUsers)

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
