//IMPORTS - Hooks
import { useContext } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
//IMPORTS - Components 
import Bttn from "../../components/UI/Bttn";
import {UserProfileContext} from "../../components/Contexts/UserProfileContext";
import { UserAccountContext } from "../../components/Contexts/UserAccountContext";
//IMPORT - REDUX
import { useDispatch, useSelector } from "react-redux";
import { friendsActions } from "../../store/slices/friendsSlice";
import { authActions }  from "../../store/slices/authSlice";

import {doc, getDoc, db, collection, getDocs, updateDoc } from "../../firebase/firebase"
//IMPORTS - Styles
import styles from "./ShowsList.module.css";

function UsersList({userDetails}) {
  console.log(userDetails)
  
  //Redux Selectors 
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.uid);
  const friendsList = useSelector((state)=> state.friends.friendsList);

  
  //Params
  const params = useParams();
  const id = params.id;

  async function addFriend(friendId){
    
    const updatedFriendsList = [...friendsList, friendId];

    try{
    const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        friendsList: updatedFriendsList
      })

      dispatch(friendsActions.addFriend(friendsList))    
      alert("Friend Added!")

    } catch (err) {
    console.log (err)
    alert(err.message);
  }
}

  return (
    <main className={styles.showWrapper}>
      {userDetails && (
          <div key={userDetails.id} className={styles.showInfo}>
            <header>
                <NavLink to={`/userPage/${userDetails.id}`}><h2>{userDetails.userName}</h2></NavLink>
                <Bttn onClick = {() => addFriend(userDetails.id)}>Save User</Bttn>
              </header>

          </div>
    )}
   </main>
  )
}
export default UsersList