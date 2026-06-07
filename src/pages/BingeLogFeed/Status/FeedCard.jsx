//IMPORTS - Hooks
//IMPORTS - Components 
import ActionBar from "./ActionBar"
//IMPORTS - REDUX

//IMPORTS - Styles
import styles from "./FeedCard.module.css"

function FeedCard({status, key}) {

   return (
    <main className={styles.mainStatusWrapper}>
      <article>
        <header className={styles.feedHeader}>
          <img src={status?.userImage || "/BingeLog/DefaultAvatar.png"}/>
          <p>{status?.userName}</p>
        </header>
        <div className={styles.feedContent}> 
          <p>Currently Binging: 
            {Array.isArray(status.statusPost.currBinging)
              ? status.statusPost.currBinging.map(show => 
                  <p key={show.id}>{show.show}</p>
                )
              : <p>{status.statusPost.currBinging}</p>
            }
          </p>
          <p>Recently Watched: {status.statusPost.recentlyWatched}</p>
          <p>Recently Finished: <span>{status.statusPost.recentlyFinished?.show}</span></p>
          <br/>
          <p>{new Date(status.timeStamp).toLocaleString()}</p>
        </div>
      </article>
      <ActionBar/>
    </main>
  )
}
export default FeedCard
