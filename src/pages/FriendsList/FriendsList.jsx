//IMPORTS - Hooks
import { useContext, useEffect, useState } from "react"
//IMPORTS - Components 
import{ UserAccountContext} from "../../components/Contexts/UserAccountContext"
import { useSelector, useDispatch } from "react-redux"
import { friendsActions } from "../../store/slices/friendsSlice"

//IMPORTS - Styles
//import styles from "./UserPage.module.css"


function FriendsList() {
  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)


  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then (res => res.json())
      .then (data => setGlobalUsers(data))
  },[])

  console.log("Friend List", friendsList)
  console.log("Global Users", globalUsers)


 return (
    <>
      <h1>Friends List</h1>
      {friendsList.map((friendId) => {
        const friend = globalUsers.find(user => user.id === friendId);
        
        return (
          <div key={friendId}>
            <p>{friend ? friend.userName : "Unknown User"}</p>
          </div>
        );
      })}
    </>
  );
}
export default FriendsList
