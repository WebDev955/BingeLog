async function handleSaveReview(showId, showTitle){
        //creat new reivew object
        const newReview = {
            id: showId,
            title: showTitle,
            text: draftReview,
            createdAt: Date.now()
        }
        const updatedReviews = [...myReviews, newReview]

        try {
            const docRef = doc(db, "Users", userId)
           
            await updateDoc(docRef, {
                reviews: updatedReviews,
            });
            alert ("Review Saved!")
        } catch(err){
            console.log(err)
        }
        dispatch(showActions.updateReviews(updatedReviews))
    }   


//status 
const statuses = [{
    id: 1,
    text: "Currently binging...Recently Watched...Recently Finsihed...",
    likes: null,
    shockedReacts: null,
      chats:[{
        id:1,
        userA: "userAUserName",
        userAText: "You finsished Star Trek! How was it?",
        userBReply: "It was great!"
      }]
}]



//BingeLog Feeds
//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPage.module.css"

//IMPORTS - Hooks
import { useContext, useEffect, useState } from "react"

//IMPORTS - Components 
import{ UserAccountContext} from "../../components/Contexts/UserAccountContext"
import { useSelector, useDispatch } from "react-redux"
import { friendsActions } from "../../store/slices/friendsSlice"

import {doc, getDoc, db, collection, getDocs } from "../../firebase/firebase"


function BingeLog() {

  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(() => {
    async function fetchGlobalUsers(){
      try {
        const docRef = await getDocs(collection (db, "Users")); //makes a general refereneto the doc, "Users" (user ids)
        const globalUsersList = docRef.docs.map(doc =>({
          id: doc.id,
          ...doc.data()
        }))
        setGlobalUsers(globalUsersList) //set the DATA of docSnap to global users state
      
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
