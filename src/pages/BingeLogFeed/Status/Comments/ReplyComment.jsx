//Imports - Hooks
import { useState } from "react";
//Imports - Hooks
//mport styles from "./CommentChats.module.css"
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
  statusId,
  commentId,
  threadId,
  replyAuthor,
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
      replyId: crypto.randomUUID(),
      authorId: userId,
      authorUserName: userName,
      authorImg: userImg,
      timeStamp: new Date().getTime(),
      text: replyDraft,
    };

    try {
      console.log("threadId:", threadId, "commentId:", commentId);
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
          statusId: statusId,
          commentId: commentId,
          newReply: newReply,
        }),
      );
    } catch (err) {
      console.log(err);
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
