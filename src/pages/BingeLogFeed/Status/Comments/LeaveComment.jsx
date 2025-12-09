//IMPORTS - HOOKS

//IMPORTS - STYLES
//IMPORTS - Styles
import styles from "./LeaveComment.module.css"

function LeaveComment (){

    function postCommentHandler() {
        // 1. save Comment to entire single status of userA (status poster)
            //a. save status of all users into a single Statuses[] 
                // - contains all Status{}
                    // - contains all Chats [{chat 1}, {chat 2}]
        // 2. save Comment of userB (posted on UserA's status) 
    }

    return (
        <main>
            <div className = {styles.commentBoxWrapper}>
                <textarea/> 
            </div> 
            <button onClick = {postCommentHandler}>Post</button>
        </main>
    )

}

export default LeaveComment