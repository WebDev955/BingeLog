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

  console.log(friendStatuses.length)

  return (
    <main className = {styles.mainAutoFeedWrappe}>
      <h1>BingeLog Feed - Auto Updates </h1>
        <div className = {styles.sortingDiv}>
          <p>Sort by username</p> 
          <p>Sort by most recently updated</p>
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