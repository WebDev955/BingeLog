//IMPORTS - Hooks
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//IMPORTS - Components
import FeedCard from "../../BingeLogFeed/Status/FeedCard";
//IMPORTS - Firebase
import {
  db,
  collection,
  query,
  where,
  getDocs,
} from "../../../firebase/firebase";
//IMPORTS - Styles
import styles from "./MyPosts.module.css";

function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = useSelector((state) => state.auth.user.uid);

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        const autoStatusRef = collection(db, "autoStatuses");
        const myPostsQuery = query(autoStatusRef, where("userId", "==", userId));
        const snapshot = await getDocs(myPostsQuery);
        const posts = snapshot.docs.map((doc) => doc.data());
        const sorted = [...posts].sort((a, b) => b.timeStamp - a.timeStamp);
        setMyPosts(sorted);
      } catch (err) {
        console.error("Failed to fetch your posts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyPosts();
  }, [userId]);

  return (
    <main className={styles.mainWrapper}>
      <h3>My Posts</h3>
      {isLoading ? (
        <p>Loading your posts...</p>
      ) : myPosts.length === 0 ? (
        <p>You haven't posted any updates yet.</p>
      ) : (
        myPosts.map((status) => (
          <FeedCard key={status.statusId} status={status} />
        ))
      )}
    </main>
  );
}
export default MyPosts;
