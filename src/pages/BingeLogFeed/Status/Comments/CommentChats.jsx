//IMPORTS - Hooks
import { useState } from "react"
//IMPORTS - Styles

//IMPORTS - COMPONENTS
import LeaveComment from "./LeaveComment"

function CommentChats() {

    const [displayReplyComment, setDisplayReplyComment] = useState (false)

    function replyHandler(){
        setDisplayReplyComment(true)
    }

    return (
        <main>
            <div>
                <h3>COMMENT CHAT CHAINS</h3>
                <p>User B comment</p>
                <button onClick = {replyHandler}>Reply</button>
            </div>
                {displayReplyComment && <LeaveComment/>}
        </main>
    )
    }
export default CommentChats
