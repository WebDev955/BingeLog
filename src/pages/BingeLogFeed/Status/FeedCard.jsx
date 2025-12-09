//IMPORTS - Hooks

//IMPORTS - Components 
import ActionBar from "./ActionBar"

//IMPORTS - REDUX

//IMPORTS - Styles
import styles from "./FeedCard.module.css"

function FeedCard({friend, key}) {

  return (
          <main key={key} className = {styles.mainFeedWrapper}>
            <article>
              <header className={styles.feedHeader}>
                <img  src="/BingeLog/DefaultAvatar.png"/>
                 {/*<img src={userProfile.bioAvatar} width="40" height="40"/>  */}
                <p>{friend?.userName}</p>
              </header>
              <div> 
                <p>Currently Binging: {""}
                  {/*friend.myShows.bingeStatus.  */}       
                  {friend.currentlyBinging?.length > 0
                    ? friend.currentlyBinging.map((show) =>show.show).join(", ")
                    :  `${friend.userName} is not currently binging anything` 
                  }
                </p> <br/>
                <p>
                  Recently Watched: {""}
                  {friend.watchedEps?.length > 0
                    ?`${friend.watchedEps[friend.watchedEps.length-1].epName} -
                      ${friend.watchedEps[friend.watchedEps.length-1].showName}`
                    : `${friend.userName} has not recently watched anything`
                  }
                </p><br/>

                <p>Recently Finished: {""}
                  {friend.finishedShows?.length > 0 
                   ? friend.finishedShows[friend.finishedShows.length -1].show 
                   : `${friend.userName} has not recently finshed anything`
                  }
                </p>
              </div>
            </article>
            <ActionBar/>
          </main>
  )
}
export default FeedCard



