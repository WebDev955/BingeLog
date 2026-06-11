//IMPORTS - Hooks
import { useState } from "react"
import { useSelector } from "react-redux"
//IMPORTS - COMPONENTS
import LeaveComment from "./LeaveComment"
import LeaveComment2 from "./LeaveComment2"
//IMPORTS - SLICES/STATES
import { chatsActions } from "../../../../store/slices/chatsSlice"
//IMPORTS - Styles
import styles from "./CommentChats2.module.css"
import ReplyComment from "./ReplyComment"
import CommentIcon from "../../../../../public/LeaveComment.png"

function CommentChats2 ({status}) {
    const [displayReply, setDisplayReply] = useState(false)

	const userId = useSelector((state) => state.auth.user.uid)
    const allThreads = useSelector((state) => state.chats.chatThreads)

    const chatThread = useSelector((state) => 
        state.chats.chatThreads.find(thread => thread.relatedStatusId === status.statusId)
    )
    const comments = chatThread?.comments ?? []
    const replies = comments?.replies
    const isUserCommenting = chatThread?.commentingUsers.includes(userId)

    return (
        <main className= {styles.commentMessagesWrapper}>
            <h3>Comment Messages</h3> 
            <div>
                {!chatThread && <LeaveComment2 status={status}/>}
            </div>
            <div>
                {isUserCommenting && comments && comments.map((comment) =>
                    <div key={comment.commentId} className={styles.commentWrapper}>
                        <header className = {styles.commentHeader}>
                            <img src={comment.authorImg}/>
                            <p>{comment.authorUserName}</p> 
                            <p>{new Date(comment.timeStamp).toLocaleString()}</p>
                        </header>
                        <article className = {styles.commentContent}>
                            <p>{comment.text}</p>
                           
                            <img onClick = {() => setDisplayReply(!displayReply)}src={CommentIcon} width= "30"/>
                           {displayReply && <ReplyComment status={status} />}
                        </article> 
                        {isUserCommenting && replies && comment.replies.map((reply) =>
                            <div key={reply.replyId}>
                                <header>
                                    <img src={reply.authorImg}/>
                                    <p>{reply.authorUserName}</p>
                                </header>
                                <article>
                                    <p>{reply.text}</p>
                                    <p>{new Date(reply.timeStamp).toLocaleString()}</p>
                                </article> 
                                <ReplyComment status={status} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}

export default CommentChats2