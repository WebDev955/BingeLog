//IMPORTS - Hooks
import { useState } from "react"
//IMPORTS - Styles
import styles from "./ActionBar.module.css"
//IMPORTS - COMPONENTS
import LeaveComment from "./Comments/LeaveComment"
import CommentChats from "./Comments/CommentChats"

function ActionBar() {

  const [comment, setComment] = useState(false)
  const [likeCount, setLikeCount] = useState(null)

  const [commentChats, setCommentChats] = useState(false)

  function displayComment(){
    setComment(true)

    if (comment){
      setComment(false)
    }
  }

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
      <div>
        <img width = "30x" onClick={displayComment} src="/BingeLog/LeaveComment.png"/> 
        <img width = "30x" onClick={updateLikeCount} src="/BingeLog/HeartReact.png"/> 
          {likeCount}
        <img width = "30x" onClick={displayCommentChats} src="/BingeLog/CommentChats.png"/>
      </div>
      <div>
        {comment && <LeaveComment/>}
        {commentChats && <CommentChats/>}
      </div>
  </main>
  )
}
export default ActionBar
