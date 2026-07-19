//IMPORTS - Hooks
import { useState } from "react";
import { useSelector } from "react-redux";
//IMPORTS - Styles
// import styles from "./CommentChats2.module.css";
import styles from "./CommentChats2UPDATE.module.css";
import ReplyComment from "./ReplyComment";
import CommentIcon from "../../../../../public/LeaveComment.png";
import LeaveComment2 from "./LeaveComment2";

function CommentChats2({ status }) {
  //ESTABLISH STATE
  const [displayReply, setDisplayReply] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  //DERIVE USER DATA FROM SLICES
  const userId = useSelector((state) => state.auth.user.uid);
  const isOwner = status.userId === userId;

  //FUNCTION - FIND ALL RELATED STATUS THREADS
  //correctly gives data for every related status thread
  const statusThreads = useSelector((state) =>
    state.chats.chatThreads.filter(
      (thread) => thread.relatedStatusId === status.statusId,
    ),
  );

  console.log(status)

  //FUNCTION - RESOLVE THE ONE THREAD TO DISPLAY
  //Owner: whichever thread they've clicked in the selector below.
  //Friend: the single thread they're a participant in (should only ever be one).
  const chatThread = isOwner
    ? statusThreads.find((thread) => thread.threadId === selectedThreadId)
    : statusThreads.find((thread) => thread.commentingUsers.includes(userId));

  const replyHandler = (key) => {
    setDisplayReply((prev) => (prev === key ? null : key));
  };

  //DERIVED DATA FROM FUNCTIONS
  const threadId = chatThread?.threadId;
  const comments = chatThread?.comments ?? [];
  const isUserCommenting = chatThread?.commentingUsers.includes(userId);

  return (
    <main className={styles.commentMessagesWrapper}>
      {isOwner && statusThreads.length > 0 && (
        <div className={styles.threadSelector}>
          <h3>Conversations</h3>
          {statusThreads.map((thread) => {
            const friendId = thread.commentingUsers.find(
              (id) => id !== status.userId,
            );
            return (
              <button
                key={thread.threadId}
                onClick={() => setSelectedThreadId(thread.threadId)}
              >
                {friendId}
              </button>
            );
          })}
        </div>
      )}
      {!chatThread && <LeaveComment2 status={status} />}
      {isUserCommenting && comments.length > 0 && (
        <>
          <h3>Comment Messages</h3>
          {comments.map((comment, index) => (
            <div key={comment.commentId} className={styles.commentWrapper}>
              <header className={styles.commentHeader}>
                <img src={comment.authorImg} />
                <p>{comment.authorUserName}</p>
                <p>{new Date(comment.timeStamp).toLocaleString()}</p>
              </header>
              <article className={styles.commentContent}>
                <p>{comment.text}</p>
                {!comment.replies?.length && (
                  <img
                    onClick={() => replyHandler(`comment-${index}`)}
                    src={CommentIcon}
                    width="40px"
                  />
                )}
                {displayReply === `comment-${index}` && (
                  <ReplyComment
                    status={status}
                    threadId={threadId}
                    commentId={comment.commentId}
                    onReplyPosted={() => setDisplayReply(null)}
                  />
                )}
              </article>
              {comment.replies?.length > 0 &&
                comment.replies.map((reply, replyIndex) => (
                  <div key={reply.replyId} className={styles.replyWrapper}>
                    <header className={styles.replyHeader}>
                      <img src={reply.authorImg} />
                      <p>{reply.authorUserName}</p>
                      <p>{new Date(reply.timeStamp).toLocaleString()}</p>
                    </header>
                    <article className={styles.replyContent}>
                      <p>{reply.text}</p>
                      {replyIndex === comment.replies.length - 1 && (
                        <img
                          onClick={() =>
                            replyHandler(`reply-${index}-${replyIndex}`)
                          }
                          src={CommentIcon}
                          width="40px"
                        />
                      )}
                      {displayReply === `reply-${index}-${replyIndex}` && (
                        <ReplyComment
                          status={status}
                          threadId={threadId}
                          replyAuthor={reply.authorUserName}
                          commentId={comment.commentId}
                          onReplyPosted={() => setDisplayReply(null)}
                        />
                      )}
                    </article>
                  </div>
                ))}
            </div>
          ))}
        </>
      )}
    </main>
  );
}
export default CommentChats2;
