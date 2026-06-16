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

function CommentsList ({status, comments, threadId, isUserCommenting}) {
    console.log(status)
    const [displayReply, setDisplayReply] = useState(false)
    const userId = useSelector((state) => state.auth.user.uid)

    const chatThread = useSelector((state) => 
        state.chats.chatThreads.find(thread => thread.relatedStatusId === status.statusId)
    )

    return (
        <main className= {styles.commentMessagesWrapper}>
                {isUserCommenting && comments && comments.map((comment) =>
                    <div key={comment.commentId} className={styles.commentWrapper}>
                        <header className = {styles.commentHeader}>
                            <img src={comment.authorImg}/>
                            <p>{comment.authorUserName}</p> 
                            <p>{new Date(comment.timeStamp).toLocaleString()}</p> 
                        </header> 
                        <article className = {styles.commentContent}>
                            <p>{comment.text}</p>
                                <ReplyComment status={status} threadId={threadId} commentId={comment.commentId}/>
                        </article> 
                    </div>   
                )}    
        </main>
    )
}


export default CommentsList