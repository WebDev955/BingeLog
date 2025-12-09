//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"
import BingeLogPageAuto from "./BingeLogPageAuto"
import BingeLogPageManual from "./BingeLogPageManual"

//IMPORTS - Styles
import styles from "./BingeLogPage.module.css"

//IMPORTS - Hooks
import { useEffect, useState } from "react"

import {db, collection, getDocs } from "../../firebase/firebase"


function BingeLog() {



  const [globalUsers, setGlobalUsers] = useState([])

  const [feedType, setFeedType] = useState ("auto")

  function displayManualFeed(){
    setFeedType("manual")
  }

  function displayAutoFeed(){
    setFeedType("auto")
  }


  useEffect(() => {
    async function fetchGlobalUsers(){
      try {
        const docRef = await getDocs(collection (db, "Users")); //makes a general refereneto the doc, "Users" (user ids)
        const globalUsersList = docRef.docs.map(doc =>({
          id: doc.id,
          ...doc.data()
        }))
        setGlobalUsers(globalUsersList) //set the DATA of docSnap to global users state
      
      } catch (err) {
        console.error ("Can't find global users", err)
      }
    }
    fetchGlobalUsers()
  },[])
  
console.log(globalUsers)

  return (
    <main className = {styles.mainWrapper}>
      <h1>BingeLog Feed</h1>
      <div>
        <button onClick={displayAutoFeed}>View Auto Updates</button>
        <button onClick={displayManualFeed}>View Manuel Updates</button>
      </div>
      {feedType === "auto" 
        ? <BingeLogPageAuto globalUsers={globalUsers}/>
        : <BingeLogPageManual globalUsers={globalUsers}/>
      }
      </main>
  ) 
}
export default BingeLog
