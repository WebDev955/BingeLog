//IMPORTS - Hooks
//IMPORTS - Components
import ActionBar from "./ActionBar";
//IMPORTS - REDUX

//IMPORTS - Styles
// import styles from "./FeedCard.module.css";
import styles from "./FeedCardUPDATE.module.css";

function FeedCard({ status }) {
  const currBinging = status.statusPost.currBinging;
  const recentlyWatched = status.statusPost.recentlyWatched;
  const recentlyFinished = status.statusPost.recentlyFinished?.show;

  return (
    <main className={styles.mainStatusWrapper} key={status.statusId}>
      <article>
        <header className={styles.feedHeader}>
          <img src={status?.userImage || "/BingeLog/DefaultAvatar.png"} />
          <p>{status?.userName}</p>
        </header>
        <div className={styles.feedContent}>
          <p>Currently Binging:</p>
          <div className={styles.binging}>
            {Array.isArray(currBinging) && currBinging.length >= 1 ? (
              currBinging.map((show) => <p key={show.id}>{show.show}</p>)
            ) : (
              <p>{status.userName} is currently not binging anything.</p>
            )}
          </div>
          <p>Recently Watched: {recentlyWatched}</p>
          <p>
            Recently Finished: <span>{recentlyFinished}</span>
          </p>
          <br />
          <p>{new Date(status.timeStamp).toLocaleString()}</p>
        </div>
      </article>
      <ActionBar status={status} />
    </main>
  );
}
export default FeedCard;
