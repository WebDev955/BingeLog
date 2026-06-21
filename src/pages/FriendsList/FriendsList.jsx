//IMPORTS - Hooks
import { useEffect, useState } from "react"
//IMPORTS - Components 
import { useSelector, useDispatch } from "react-redux"
//import { friendsActions } from "../../store/slices/friendsSlice"
import {db, collection, getDocs } from "../../firebase/firebase"

//IMPORTS - Styles
import styles from "../FriendsList/FriendsList.module.css"


function FriendsList() {
  const [globalUsers, setGlobalUsers] = useState([])
  const friendsList = useSelector((state) => state.friends.friendsList)
  const friend = friendsList.map((friendId) => 
    globalUsers.find(user => user.id === friendId)).filter(Boolean)

  useEffect(() => {
    async function fetchGlobalUsers(){
      try {
        const docRef = await getDocs(collection(db, "Users")); //Grab all Docs (users) inside collection "Users"
        const usersList = docRef.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        
        setGlobalUsers(usersList) //set the DATA of docSnap to global users state
      } catch (err) {
        console.error ("Can't find global users", err)
      }
    }
    fetchGlobalUsers()
  },[])


console.log(friend)

 return (
    <main className={styles.mainWrapper}>
      <h1>Friends List</h1>
      {friend.map((friend) =>
        <div key={friend.id} className={styles.friendCard}>
          <img src={friend?.profileImgUrl} width= "55px"/>
          <p>{friend?.userName || "Unknown User"}</p>
      </div>
    )}
    </main>
  );
}
export default FriendsList
