//IMPORTS - Hooks
import { useEffect, useState } from "react"
//IMPORTS - Components 

//IMPORTS - REDUX





//IMPORTS - Styles
import styles from "./FeedCard.module.css"

function FeedCard({friend, key}) {

  const [commentChat, setCommentChat] = useState(false)
  const [likeCount, setLikeCount] = useState(null)

  function displayCommentChat(){
    setCommentChat(true)
    
    if (commentChat){
      setCommentChat(false)
    }
  }

  function updateLikeCount(){
    setLikeCount (likeCount + 1)
  }



  return (
  
          <main key={key} className = {styles.mainWrapper}>
            <article>
              <header className={styles.header}>
                 {/*<img src={userProfile.bioAvatar} width="40" height="40"/>  */}
                <p>{friend?.userName}</p>
              </header>
              <div>
                <p>Currently Binging: {""}
                  {friend.currentlyBinging?.length > 0
                    ? friend.currentlyBinging.map((show) =>show.show).join(", ")
                    : "Friend is not bining anything" }
                </p>
                <p>
                  Recently Watched: {""}
                  {friend.watchedEps?.length > 0
                    ?`${friend.watchedEps[friend.watchedEps.length-1].epName} -
                      ${friend.watchedEps[friend.watchedEps.length-1].showName}`
                    : "Friend has not recently watched anything"}
                </p>

                <p>Recently Finished: {""}
                  {friend.finishedShows?.length > 0 
                   ? friend.finishedShows[friend.finishedShows.length -1].show 
                   : ""}
                </p>
              </div>
            </article>
            <div className={styles.actionBar}>
              <img width = "30x" onClick={displayCommentChat} src="/BingeLog/LetsChatReact.png"/> 
              <img width = "30x" onClick={updateLikeCount} src="/BingeLog/HeartReact.png"/> {likeCount}
              <img width = "30x" src="/BingeLog/ShockedReact.png"/>
            </div>
           {commentChat && <textarea/> }
          </main>
  )
}
export default FeedCard



