//IMPORTS - Hooks
import { useContext, useEffect, useState } from "react"
//IMPORTS - Components 
import{ UserAccountContext} from "../../components/Contexts/UserAccountContext"
import { useSelector, useDispatch } from "react-redux"
import { friendsActions } from "../../store/slices/friendsSlice"
import {doc, getDoc, db, collection, getDocs } from "../../firebase/firebase"

//IMPORTS - Styles
//import styles from "./UserPage.module.css"


function FriendsList() {
  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)


  const [globalUsers, setGlobalUsers] = useState([])

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
  
  
  console.log("Global Users", globalUsers)
  console.log("Friend List", friendsList)

 return (
    <>
      <h1>Friends List</h1>
      {friendsList.map((friendId) => {
        const friend = globalUsers.find(user => user.id === friendId);
        
        return (
          <div key={friendId}>
            <p>{friend?.userName || "Unknown User"}</p>
          </div>
        );
      })}
    </>
  );
}
export default FriendsList
