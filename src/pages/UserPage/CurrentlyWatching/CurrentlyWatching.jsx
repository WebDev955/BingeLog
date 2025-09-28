//IMPORTS - Hooks
//IMPORTS - Components 
//IMPORTS - Styles
import styles from "./CurrentlyWatching.module.css"
//IMPORTS - REDUX
import { useSelector } from "react-redux"

function CurrentlyWatching() {
  
  const currentlyBinging = useSelector((state) => state.shows.currentlyBinging)

  console.log(currentlyBinging)



  return (
    <>
      <main className={styles.curWatchingWrapper}>
        <h2>Currently Binging:</h2>
        <div className={styles.watchingList}>
          {currentlyBinging.map((show) => (
            <p key= {show.id}>{show.show}</p>
          ))}
        </div>
      </main>
    </>
  )
}
export default CurrentlyWatching
