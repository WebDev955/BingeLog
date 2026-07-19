//Imports - Hooks
import { useState } from "react";
//Imports - Hooks
import styles from "./ReplyComment.module.css";
//IMPORTS - SLICES
import { useSelector, useDispatch } from "react-redux";
import {
  doc,
  db,
  updateDoc,
  setDoc,
  arrayUnion,
} from "../../../../firebase/firebase";
import { chatsActions } from "../../../../store/slices/chatsSlice";
//Status.statusId is prop
//passed from ActionBar (which was passed from FeedCard)

export const ReplyComment = ({
  status,
  commentId,
  threadId,
  replyAuthor,
  onReplyPosted,
}) => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.user.userName);
  const userId = useSelector((state) => state.auth.user.uid);
  const userImg = useSelector((state) => state.profile.profileImgUrl);

  const [replyDraft, setReplyDraft] = useState("");

  const updateReply = (value) => {
    setReplyDraft(value);

    
  };
  async function postReply(replyDraft) {
    const newReply = {
      threadId: threadId,
      replyId: crypto.randomUUID(),
      authorId: userId,
      authorUserName: userName,
      authorImg: userImg,
      timeStamp: new Date().getTime(),
      text: replyDraft,
    };

    try {
      const docRefComments = doc(
        db,
        "chatThreads",
        threadId,
        "comments",
        commentId,
      );
      await updateDoc(docRefComments, {
        replies: arrayUnion(newReply),
      });

      dispatch(
        chatsActions.updateReplies({
          statusId: status.statusId,
          threadId: threadId,
          commentId: commentId,
          reply: newReply,
        }),
      );
      setReplyDraft("");
      onReplyPosted?.();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className={styles.leaveReplyWrapper}>
      <h3>Post a Reply</h3>
      <div className={styles.postAReply}>
        <textarea
          value={replyDraft}
          onChange={(e) => updateReply(e.target.value)}
          placeholder={`Reply to ${replyAuthor}`}
        />
        <button onClick={() => postReply(replyDraft)}>Post Reply</button>
      </div>
    </main>
  );
};

export default ReplyComment;
