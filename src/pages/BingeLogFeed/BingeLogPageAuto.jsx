//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPageAuto.module.css"

//IMPORTS - Hooks

//IMPORTS - Components 
import { useSelector } from "react-redux"
import { socialFeedActions } from "../../store/slices/socialFeedSlice"

function BingeLogPageAuto() {

  const friendStatuses = useSelector((state) => state.socialfeed.autoStatuses)

  
  return (
    <main className = {styles.mainAutoFeedWrappe}>
      <h1>BingeLog Auto Feed</h1>
        <div className = {styles.sortingDiv}>
          <h3>Sort:</h3>
          <p>Username</p> 
          <p>Recently Updated</p>
        </div>
        {friendStatuses?.length === 0 
          ? <p>Add friends to see what they are watching!</p>
          : friendStatuses.map((status) => (
              <FeedCard key={status.statusId} status={status} />
          ))


        }
      </main>
  ) 
}
export default BingeLogPageAuto