//IMPORTS - Hooks
import { useState } from "react"
//IMPORTS - Styles
import styles from "./CommentChats.module.css"

//IMPORTS - COMPONENTS
import LeaveComment from "./LeaveComment"

function CommentChats() {

    const [displayReplyComment, setDisplayReplyComment] = useState (false)

    function replyHandler(){
        setDisplayReplyComment(true)
    }

    return (
        <main className= {styles.commentChatChainWrapper}>
            <h3>COMMENT CHAT CHAINS</h3>
                <div className= {styles.commentChatChain}>
                    <textarea
                        defaultValue={"User B Comment"}
                    />
                    <button onClick = {replyHandler}>Reply (user a to b)</button>
                    {displayReplyComment && <LeaveComment/>}
                    <textarea
                        defaultValue={"User A Reply"}
                    />
                    <button onClick = {replyHandler}>Reply (user b to a)</button>
                    {displayReplyComment && <LeaveComment/>}
                </div>
        </main>
    )
    }
export default CommentChats
