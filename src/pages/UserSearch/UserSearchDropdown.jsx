//IMPORTS - Hooks
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";
//IMPORTS - Components
import UsersList from "./UserList";
import Bttn from "../../components/UI/Bttn";
import { UserProfileContext } from "../../components/Contexts/UserProfileContext";
import { UserAccountContext } from "../../components/Contexts/UserAccountContext";

//IMPORTS - Styles
import styles from "./UserSearchDropdown.module.css";

//IMPORT - REDUX
import { useDispatch, useSelector } from "react-redux";
import { friendsActions } from "../../store/slices/friendsSlice";
import { authActions } from "../../store/slices/authSlice";

import {
  doc,
  getDoc,
  db,
  collection,
  getDocs,
  updateDoc,
} from "../../firebase/firebase";

function UserSearchDropdown({ searchResults }) {
  //Redux Selectors
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.uid);
  const friendsList = useSelector((state) => state.friends.friendsList);

  console.log("User", searchResults);

  //Params
  const params = useParams();
  const id = params.id;

  async function addFriend(friendId) {
    const updatedFriendsList = [...friendsList, friendId];

    try {
      const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        friendsList: updatedFriendsList,
      });

      dispatch(friendsActions.addFriend(friendsList));
      alert("Friend Added!");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }

  console.log("Search Results in Dropdown", searchResults);

  const [selectedUser, setSelectedUser] = useState(null);

  function displayUserDetails(user) {
    setSelectedUser(user);
  }

  return (
    <>
      <div className={styles.mainDropdownWrapper}>
        <div>
          {searchResults.map((user) => (
            <div className={styles.userNameWrapper}>
              <img src={user.profileImgUrl} />
              <NavLink to={`/userPage/:${user.id}`}>
                <p>Profile Link</p>
              </NavLink>
              <p key={user.uid} onClick={() => displayUserDetails(user)}>
                {user.userName}
              </p>
              <button onClick={() => addFriend(user.id)}>Save User</button>
            </div>
          ))}
        </div>
      </div>
      <div>{selectedUser && <UsersList userDetails={selectedUser} />}</div>
    </>
  );
}
export default UserSearchDropdown;
