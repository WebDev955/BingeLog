//IMPORTS - Hooks
import { useState } from "react"
//IMPORTS - Styles
import styles from "./ActionBar.module.css"
//IMPORTS - COMPONENTS
import LeaveComment from "./Comments/LeaveComment"
import CommentChats from "./Comments/CommentChats"
import CommentChats2 from "./Comments/CommentChats2"

function ActionBar({status}) {

  const [likeCount, setLikeCount] = useState(null)
  const [commentChats, setCommentChats] = useState(false)

  function displayCommentChats(){
    setCommentChats(true)

    if (commentChats){
      setCommentChats(false)
    }
  }

  function updateLikeCount(){
    setLikeCount (likeCount + 1)
  }

  return (
    <main className = {styles.actionBarWrapper}>
      <div className = {styles.actionBarIconRow}>
        <img width = "30x" onClick={updateLikeCount} src="/BingeLog/HeartReact.png"/> 
          {likeCount}
        <img width = "30x" onClick={displayCommentChats} src="/BingeLog/CommentChats.png"/>
      </div>
      <div>
        {commentChats && <CommentChats2 status={status}/>}
      </div>
  </main>
  )
}
export default ActionBar
