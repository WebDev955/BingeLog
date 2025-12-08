//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPageManual.module.css"

//IMPORTS - Hooks
import { useContext, useEffect, useState } from "react"

//IMPORTS - Components 
import{ UserAccountContext} from "../../components/Contexts/UserAccountContext"
import { useSelector, useDispatch } from "react-redux"
import { setFriendsList, addFriend } from "../../store/slices/friendsSlice";

import {doc, getDoc, db, collection, getDocs } from "../../firebase/firebase"


function BingeLogPageManual({globalUsers}) {

  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  //const [globalUsers, setGlobalUsers] = useState([])



  return (
    <main className = {styles.mainWrapper}>
      <h1>BingeLog Feed - Live Updates</h1>
        <div className = {styles.sortingDiv}>
          <p>Sort by username</p> 
          <p>Sort by most recently updated</p>            
        </div>

      {friendsList?.map((friendId) => {  
        const friend = globalUsers.find(friend => friend.id === friendId);  
        if (!friend) return null
        return <FeedCard key={friend.id} friend = {friend}/>
      })}
      </main>
  ) 
}
export default BingeLogPageManual
