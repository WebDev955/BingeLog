//IMPORTS - Hooks
import { useEffect, useState } from "react";
//IMPORTS - Components
import { useSelector, useDispatch } from "react-redux";
import { friendsActions } from "../../store/slices/friendsSlice";
import { db, doc, updateDoc, collection, getDocs } from "../../firebase/firebase";

//IMPORTS - Styles
import styles from "../FriendsList/FriendsList.module.css";

function FriendsList() {
  const dispatch = useDispatch();
  const [globalUsers, setGlobalUsers] = useState([]);
  const userId = useSelector((state) => state.auth.user.uid);
  const friendsList = useSelector((state) => state.friends.friendsList);
  const friend = friendsList
    .map((friendId) => globalUsers.find((user) => user.id === friendId))
    .filter(Boolean);

  useEffect(() => {
    async function fetchGlobalUsers() {
      try {
        const docRef = await getDocs(collection(db, "Users")); //Grab all Docs (users) inside collection "Users"
        const usersList = docRef.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGlobalUsers(usersList); //set the DATA of docSnap to global users state
      } catch (err) {
        console.error("Can't find global users", err);
      }
    }
    fetchGlobalUsers();
  }, []);

  async function removeFriend(friendId) {
    const updatedFriendsList = friendsList.filter((id) => id !== friendId);

    try {
      const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        friendsList: updatedFriendsList,
      });

      dispatch(friendsActions.removeFriend(updatedFriendsList));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <main className={styles.mainWrapper}>
      <h1>Friends List</h1>
      {friend.map((friend) => (
        <div key={friend.id} className={styles.friendCard}>
          <img src={friend?.profileImgUrl} width="55px" />
          <p>{friend?.userName || "Unknown User"}</p>
          <button
            className={styles.removeBttn}
            onClick={() => removeFriend(friend.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </main>
  );
}
export default FriendsList;
