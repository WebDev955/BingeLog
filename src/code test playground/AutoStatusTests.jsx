const AutoStatus = {
  userId: "User001",
  statusId: crypto.randomUUID(),
  
  statusPost: {
    currentlyBinging: "string",
    recentlyWatched: "string",   
    recentlyFinished: "string"
  },

  chatThreads: [
    {
      threadId: crypto.randomUUID(),
      participants: ["User001", "User002"],  
      visibility: "private",                 
      initiatedBy: "User002",
      
      comments: [
        {
          commentId: crypto.randomUUID(),
          authorId: "User002",
          text: "What did you think of Veep's ending?",
          timestamp: "ISO8601",
          
          replies: [
            {
              replyId: crypto.randomUUID(),
              authorId: "User001",
              text: "It was great!",
              timestamp: "ISO8601"
            },
            {
              replyId: crypto.randomUUID(),
              authorId: "User002",
              text: "I loved the epilogue",
              timestamp: "ISO8601"
            }
          ]
        }
      ]
    }
  ]
}


//update function 

//IMPORTS - Hooks

import Bttn from "../../../components/UI/Bttn"
import { useEffect, useState } from "react"
//IMPORTS - Components 
import { UserProfileContext } from "../../../components/Contexts/UserProfileContext"
import Input from "../../../components/UI/Input"
//IMPORTS - Styles
import styles from "./ShowNotes.module.css"

//IMPORTS - REDUX
import { useSelector, useDispatch } from "react-redux"
import { notesActions } from "../../../store/slices/notesSlice"
import { showActions } from "../../../store/slices/showsSlice"
import { authActions } from "../../../store/slices/authSlice"
import { socialFeedActions } from "../store/slices/socialFeedSlice"
import { useAutoStatusDebounce } from "../hooks/hooks"

//import { authActions } from "../../../store/slices/authSlice"

import { db, doc, updateDoc, writeBatch, collection} from "../../../firebase/firebase"

function ShowNotes({epTitle, showTitle}) {
  //Selecting Redux State 
  
  const dispatch = useDispatch()
  const userId = useSelector((state)=> state.auth.user.uid)
  const epNotes = useSelector((state) => state.notes.epNotes)
  const charNotes = useSelector((state) => state.notes.charNotes)
  const watchedEps = useSelector((state) => state.shows.watchedEps)
  const bingedShows = useSelector((state) => state.shows.currentlyBinging)
  const recentlyFinishedShow = useSelector ((state) => state.shows.finishedShows)
  const autoStatuses = useSelector((state) => state.socialfeed.autoStatuses)

async function checkWatchedEp(epTitle, showTitle){
    const epExists = watchedEps.some(ep => 
        ep.epName === epTitle &&
        ep.showName === showTitle
      )

    let updatedWatchedEpList = null

    if (epExists){
      updatedWatchedEpList = watchedEps.filter(ep => !(ep.epName === epTitle && ep.showName === showTitle))
    } else {
      updatedWatchedEpList = [...watchedEps, {epName: epTitle, showName: showTitle}]
      alert(`Watched ${epTitle}!`)
    }
    try {
      const docRef = doc(db, "Users", userId)
         await updateDoc(docRef,{
          watchedEps: updatedWatchedEpList
        });

      dispatch(showActions.updateWatchedEps(updatedWatchedEpList))
      
    } catch (err) {
         console.error(err)
    }
    useAutoStatusDebounce()
 }
}


// ********!NEW BINGE LOG PAGE***********//
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
  const [feedType, setFeedType] = useState ("auto")

  function displayManualFeed(){
    setFeedType("manual")
  }

  function displayAutoFeed(){
    setFeedType("auto")
  }
  
console.log(globalUsers)

  return (
    <main className = {styles.mainFeedPageWrapper}>
      <div>
        <button onClick={displayAutoFeed}>View Auto Updates</button>
        <button onClick={displayManualFeed}>View Manuel Updates</button>
      </div>
      {feedType === "auto" 
        ? <BingeLogPageAuto />
        : <BingeLogPageManual />
      }
      </main>
  ) 
}
export default BingeLog

// ********!NEW BINGE LOG AUTO STATUS PAGE***********//
//IMPORTS - Components 
import FeedCard from "./Status/FeedCard"

//IMPORTS - Styles
import styles from "./BingeLogPageAuto.module.css"

//IMPORTS - Hooks

//IMPORTS - Components 
import { useSelector } from "react-redux"
import { socialFeedActions } from "../store/slices/socialFeedSlice"

function BingeLogPageAuto() {

  const friendStatuses = useSelector((state) => state.socialfeed.autoStatuses)

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

// ********!NEW BINGE LOG FEED CARD***********//
//IMPORTS - Hooks
//IMPORTS - Components 
import ActionBar from "./ActionBar"

//IMPORTS - REDUX
import { useSelector } from "react-redux"
import { profileActions} from "../../../store/slices/profileSlice"
import { friendsActions } from "../store/slices/friendsSlice"
//IMPORTS - Styles
import styles from "./FeedCard.module.css"

function FeedCard({status, key}) {

  return (
          <main key={key} className = {styles.mainStatusWrapper}>
            <article>
              <header className={styles.feedHeader}>
                <img src={status?.userImage || "/BingeLog/DefaultAvatar.png"}/>
                <p>{status?.userName}</p>
              </header>
              <div className = {styles.feedContent}> 
                <p>Currently Binging: 
                  {Array.isArray(status.statusPost.currBinging)
                    ? status.statusPost.currBinging.map(show => <p key={show}>{show}</p>)
                    : <p>{status.statusPost.currBinging}</p>
                  }
                </p> <br/>
                <p>Recently Watched:
                  {status.statusPost.recentlyWatched}
                </p><br/>
                <p>Recently Finished:
                  <span>{status.statusPost.recentlyFinished?.showTitle}</span>
                </p>
              </div>
            </article>
            <ActionBar/>
          </main>
  )
}
export default FeedCard



