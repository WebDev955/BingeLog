//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPageAuto.module.css"

//IMPORTS - Hooks


//IMPORTS - Components 

import { useSelector } from "react-redux"

function BingeLogPageAuto({globalUsers}) {

  const friendsList = useSelector((state) => state.friends.friendsList)
  //const [globalUsers, setGlobalUsers] = useState([])

  
console.log(globalUsers)
console.log(friendsList)

  return (
    <main className = {styles.mainWrapper}>
      <h1>BingeLog Feed - Auto Updates </h1>
        <div className = {styles.sortingDiv}>
          <p>Sort by username</p> 
          <p>Sort by most recently updated</p>
        </div>
      {friendsList?.map((friendId) => {  
        const friend = globalUsers.find(friend => friend.id === friendId);  
        if (!friend) return null
        return <FeedCard key={friend.id} friend = {friend}/>
      })}
      </main>
  ) 
}
export default BingeLogPageAuto
