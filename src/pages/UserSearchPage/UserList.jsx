//IMPORTS - Hooks
import { NavLink, useParams, useSearchParams } from "react-router-dom";
//IMPORTS - Components
import Bttn from "../../components/UI/Bttn";
//IMPORT - REDUX
import { useDispatch, useSelector } from "react-redux";
import { friendsActions } from "../../store/slices/friendsSlice";
import { authActions } from "../../store/slices/authSlice";
import { toastActions } from "../../store/slices/toastSlice";

import {
  doc,
  getDoc,
  db,
  collection,
  getDocs,
  updateDoc,
} from "../../firebase/firebase";
//IMPORTS - Styles
import styles from "./UserList.module.css";

function UserList({ userDetails }) {
  //Redux Selectors
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.uid);
  const friendsList = useSelector((state) => state.friends.friendsList);

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

      dispatch(friendsActions.addFriend(updatedFriendsList));
      dispatch(toastActions.showToast("Friend Added!"));
    } catch (err) {
      console.error(err);
      dispatch(toastActions.showToast(err.message, "error"));
    }
  }

  return (
    <main className={styles.userDetailsWrapper}>
      {userDetails && (
        <div key={userDetails.id}>
          <NavLink to={`/userPage/:${userDetails.id}`}>
            <h2>{userDetails.userName}</h2>
          </NavLink>
          <img src={userDetails.profileImgUrl} width="100px" alt={`${userDetails.userName}'s avatar`} />
          <br />
          <Bttn onClick={() => addFriend(userDetails.id)}>Save User</Bttn>
        </div>
      )}
    </main>
  );
}
export default UserList;
