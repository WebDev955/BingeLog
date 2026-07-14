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
  const [displayReply, setDisplayReply] = useState("");

  const chatThread = useSelector((state) =>
    state.chats.chatThreads.find(
      (thread) => thread.relatedStatusId === status.statusId,
    ),
  );
  const userId = useSelector((state) => state.auth.user.uid);
  const threadId = chatThread?.threadId;
  const comments = chatThread?.comments ?? [];
  const isUserCommenting = chatThread?.commentingUsers.includes(userId);

  const replyHandler = (key) => {
    setDisplayReply((prev) => (prev === key ? null : key));
  };
  return (
    <main className={styles.commentMessagesWrapper}>
      <div>{!chatThread && <LeaveComment2 status={status} />}</div>
      <div>
        {isUserCommenting &&
          comments && comments.map((comment, index) => (
            <div key={comment.commentId} className={styles.commentWrapper}>
              <h3>Comment Messages</h3>
              <header className={styles.commentHeader}>
                <img src={comment.authorImg} />
                <p>{comment.authorUserName}</p>
                <p>{new Date(comment.timeStamp).toLocaleString()}</p>
              </header>
              <article className={styles.commentContent}>
                <p>{comment.text}</p>
                {comment.replies?.length === 0 && (
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
      </div>
    </main>
  );
}
export default CommentChats2;
