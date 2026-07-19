//IMPORTS - Hooks
import { useState } from "react";
//IMPORTS - Styles
// import styles from "./ActionBar.module.css";
import styles from "./ActionBarUPDATE.module.css";
//IMPORTS - COMPONENTS
import CommentChats2 from "./Comments/CommentChats2";

function ActionBar({ status }) {
  const [likeCount, setLikeCount] = useState(null);
  const [commentChats, setCommentChats] = useState(false);

  function displayCommentChats() {
    setCommentChats(true);

    if (commentChats) {
      setCommentChats(false);
    }
  }

  function updateLikeCount() {
    setLikeCount(likeCount + 1);
  }

  return (
    <main className={styles.actionBarWrapper}>
      <div className={styles.actionBarIconRow}>
        <img
          onClick={updateLikeCount}
          src="/BingeLog/HeartReact.png"
          alt="Like"
        />
        {likeCount != null && <span className={styles.likeCount}>{likeCount}</span>}
        <span
          className={styles.commentIcon}
          onClick={displayCommentChats}
          role="img"
          aria-label="Comments"
        />
      </div>
      <div>{commentChats && <CommentChats2 status={status} />}</div>
    </main>
  );
}
export default ActionBar;
