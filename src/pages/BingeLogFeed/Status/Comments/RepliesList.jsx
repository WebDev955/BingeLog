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
import CommentsList from "./CommentsList"


function RepliesList (status, comments, isUserCommenting) {
    console.log(status)
    const [displayReply, setDisplayReply] = useState(false)
    
    const userId = useSelector((state) => state.auth.user.uid)

    const chatThread = useSelector((state) => 
        state.chats.chatThreads.find(thread => thread.relatedStatusId === status.statusId)
    )
    

    return (
        <main className= {styles.commentMessagesWrapper}>
            {isUserCommenting && comments.replies?.length > 0 && comments.replies.map((reply ) =>
                <div key={reply.replyId}>
                    <header className = {styles.replyHeader}>
                        <img src={reply.authorImg}/>
                        <p>{reply.authorUserName}</p>
                        <p>{new Date(reply.timeStamp).toLocaleString()}</p>
                    </header>
                    <article className = {styles.commentContent}>
                        <p>{reply.text}</p>     
                    </article> 
                </div>
            )}
        </main>
    )
}

export default RepliesList