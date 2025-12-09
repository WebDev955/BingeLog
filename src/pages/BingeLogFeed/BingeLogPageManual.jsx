//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPageManual.module.css"

//IMPORTS - Hooks


//IMPORTS - Components 

import { useSelector} from "react-redux"


function BingeLogPageManual({globalUsers}) {

  const friendsList = useSelector((state) => state.friends.friendsList)
  //const [globalUsers, setGlobalUsers] = useState([])


  return (
    <main className = {styles.mainWrapper}>
      <h1>BingeLog Feed - Manual Updates</h1>
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
export default BingeLogPageManual
