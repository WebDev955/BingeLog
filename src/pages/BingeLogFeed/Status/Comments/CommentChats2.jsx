//IMPORTS - Hooks
import { useState } from "react"
import { useSelector } from "react-redux"
//IMPORTS - COMPONENTS
import LeaveComment2 from "./LeaveComment2"
//IMPORTS - SLICES/STATES
import { chatsActions } from "../../../../store/slices/chatsSlice"
//IMPORTS - Styles
import styles from "./CommentChats2.module.css"
import ReplyComment from "./ReplyComment"
import CommentIcon from "../../../../../public/LeaveComment.png"

function CommentChats2 ({status}) {

    const [displayReply, setDisplayReply] = useState("")

    const chatThread = useSelector((state) => 
        state.chats.chatThreads.find(thread => thread.relatedStatusId === status.statusId)
    )
	const userId = useSelector((state) => state.auth.user.uid)
    const threadId = chatThread?.threadId
    const comments = chatThread?.comments ?? []
    const isUserCommenting = chatThread?.commentingUsers.includes(userId)

    const replyHandler = (index) => {
        setDisplayReply(index)
        if (setDisplayReply){
            ("")
        }
    }

    console.log(comments)
    return (
        <main className= {styles.commentMessagesWrapper}>
            <h3>Comment Messages</h3> 
            <div>
                {!chatThread && <LeaveComment2 status={status}/>}
            </div>
            <div>
                {isUserCommenting && comments && comments.map((comment, index) =>
                    <div key={comment.commentId} className={styles.commentWrapper}>
                        <header className = {styles.commentHeader}>
                            <img src={comment.authorImg}/>
                            <p>{comment.authorUserName}</p> 
                            <p>{new Date(comment.timeStamp).toLocaleString()}</p>
                        </header>
                        <article className = {styles.commentContent}>
                            <p>{comment.text}</p> 
                                {comments.length === 1 && comment.replies?.length === 0 &&
                                    <img onClick = {() => replyHandler(index)}src={CommentIcon}/>
                                }
                                {displayReply && <ReplyComment status={status} threadId={threadId} commentId={comment.commentId}/>}
                        </article>
                        {comment.replies?.length > 0 && comment.replies.map((reply, replyIndex ) =>
                            <div key={reply.replyId}>
                                <header className = {styles.replyHeader}>
                                    <img src={reply.authorImg}/>
                                    <p>{reply.authorUserName}</p>
                                    <p>{new Date(reply.timeStamp).toLocaleString()}</p>
                                </header>
                                <article className = {styles.commentContent}>
                                    <p>{reply.text}</p>
                                      {replyIndex === comment.replies.length - 1 &&
                                        <img onClick = {() => replyHandler(replyIndex)} src={CommentIcon} width="40px"/>
                                        }
                                    {displayReply && <ReplyComment status={status} threadId={threadId} replyAuthor = {reply.authorUserName} commentId={comment.commentId}/>}
                                </article> 
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}
export default CommentChats2