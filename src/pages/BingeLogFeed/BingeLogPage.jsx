//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"
import BingeLogPageAuto from "./BingeLogPageAuto"
import BingeLogPageManual from "./BingeLogPageManual"
  import { useSelector } from "react-redux";
  import { Navigate } from "react-router-dom";
//IMPORTS - Styles
import styles from "./BingeLogPage.module.css"

//IMPORTS - Hooks
import { useEffect, useState } from "react"
import {db, collection, getDocs } from "../../firebase/firebase"

function BingeLog() {
  const [feedType, setFeedType] = useState ("auto")

  function displayManualFeed(){
    setFeedType("manual")
  }

  function displayAutoFeed(){
    setFeedType("auto")
  }
  
const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

if (!isLoggedIn) {
  return <Navigate to="/" replace />;
}

  return (
    <main className = {styles.mainFeedPageWrapper}>
      <div>
        <button onClick={displayAutoFeed}>View Auto Updates</button>
        <button onClick={displayManualFeed}>View Manuel Updates</button>
      </div>
      {feedType === "auto" 
        ? <BingeLogPageAuto />
        : "Manual Statuses"
      }
      </main>
  ) 
}
export default BingeLog