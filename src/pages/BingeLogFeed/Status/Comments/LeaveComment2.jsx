//Imports - Hooks
import { useState } from "react";
//IMPORTS - FIRESTONE
import { doc, db, setDoc } from "../../../../firebase/firebase";
//Imports - Hooks
//import styles from "./CommentChats.module.css"
import styles from "./LeaveComment2.module.css";
//IMPORTS - COMPONENTS
//import LeaveComment from "./LeaveComment"

//IMPORTS - SLICES
import { useSelector, useDispatch } from "react-redux";
import { chatsActions } from "../../../../store/slices/chatsSlice";

//Status.statusId is prop
//passed from ActionBar (which was passed from FeedCard)

export const LeaveComment2 = ({ status }) => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.user.userName);
  const userId = useSelector((state) => state.auth.user.uid);
  const userImg = useSelector((state) => state.profile.profileImgUrl);

  const [commentDraft, setCommentDraft] = useState(
    "Write a comment on this status",
  );

  const updateComment = (value) => {
    setCommentDraft(value);
  };

  console.log(status);
  async function postComment(commentDraft) {
    const threadId = crypto.randomUUID();

    const newChatThread = {
      threadId: threadId,
      relatedStatusId: status.statusId,
      commentingUsers: [status.userId, userId],
      visibility: "private",
      initiatedBy: userId,
      timestamp: new Date().getTime(),
    };
    const newComment = {
      commentId: crypto.randomUUID(),
      authorId: userId,
      authorUserName: userName,
      authorImg: userImg,
      timeStamp: new Date().getTime(),
      text: commentDraft,
    };

    try {
      const docRefChatThread = doc(db, "chatThreads", threadId);

      console.log(newChatThread);
      console.log(newComment);
      await setDoc(docRefChatThread, newChatThread);

      const commentRef = doc(
        db,
        "chatThreads",
        threadId,
        "comments",
        newComment.commentId,
      );
      await setDoc(commentRef, newComment);

      dispatch(chatsActions.addChatThread(newChatThread));
      dispatch(
        chatsActions.updateComments({
          statusId: status.statusId,
          comments: [newComment],
        }),
      );
    } catch (err) {
      console.log(err);
    }
    alert("Thread and comment Made!");
  }

  return (
    <main className={styles.leaveCommentWrapper}>
      <h3>Post a Comment</h3>
      <div className={styles.postAComment}>
        <textarea
          onChange={(e) => updateComment(e.target.value)}
          placeholder={`Reply to ${status.userName}`}
        />
        <button onClick={() => postComment(commentDraft)}>Post Comment</button>
      </div>
    </main>
  );
};
export default LeaveComment2;
