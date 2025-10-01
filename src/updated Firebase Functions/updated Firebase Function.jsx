import { db, app, auth } from "../firebase/firebase";

import { authActions } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();
//Authentication
    //Login
    //Signup



//BingeLog - global users
function BingeLog() {

  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(async () => {
    doc(db, "Users")
        .then (result => result.json())
        .then (data => setGlobalUsers(data))  
  },[])
}

//FriendsList - global users search
async function addFriend(friendId){
    
    const updatedFriendsList = [...friendsList, friendId];
    
    try{
        const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef, {
                friendsList: updatedFriendsList
            })
    
        if (!result.ok) {
            throw new Error("Unable to add friend.")
        }

        dispatch(friendsActions.addFriend(updatedUser.FriendsList))
        alert("Friend Added!")
    
    } catch (err) {
    console.log (err)
    alert(err.message);
  }
}

//ShowsList - Save show
    //Save Show
async function saveShow (showDetails){
  const addedShow = {
          imdbId: showDetails.imdbId,
          title: showDetails.title,
          seasons: showDetails.seasons?.map((season) => ({
              title: season.title,
              episodes: season.episodes?.map((ep) => ({
                  title: ep.title
              }))
          }))
      }
  const updatedShows = [...myShows, addedShow]    
  
  const docRef = doc(db, 'Users', "Trekkie95")
      let result = await updateDoc(docRef, {
        myShows: updatedShows
      })
  dispatch(showActions.updateMyShows(updatedShows))
}

//MyShows
    //finished show
      async function checkOffFinishedShow(showTitle, id){
        const showExists = finishedShows.some(show => show.id === id)
        let updatedFinshedShowList
    
        if (showExists){
          updatedFinshedShowList = finishedShows.filter(show => show.id !==id)
          
        } else {
          updatedFinshedShowList = [...finishedShows, {show:showTitle, id: id}]
          alert(`Finished ${showTitle}!`)
        }
        
        const docRef = doc(db, 'Users', "Trekkie95")
            let result = await updateDoc(docRef,{
                finishedShows: updatedFinshedShowList
            })

          dispatch(showActions.updateFinishedShows(updatedFinshedShowList))
      }


    //checkBinging
    async function checkOffBinging(showTitle, id){
          const showExists = currentlyBinging.some(show => show.id === id)
          let updatedBingeList
    
          if (showExists) {
            updatedBingeList = currentlyBinging.filter(show => show.id !== id)
            } else {
                updatedBingeList = [...currentlyBinging, {show:showTitle, id: id}]
            }

          const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef,{
                currentlyBinging: updatedBingeList
            })
          
        dispatch(showActions.updateBinging(updatedBingeList))
    }

//ShowNotes
    //watchedEp
    async function checkWatchedEp(epTitle, showTitle){
        const epExists = watchedEps.some(ep => 
            ep.epName === epTitle &&
            ep.showName === showTitle
          )
        let updatedWatchedEpList
    
        if (epExists){
          updatedWatchedEpList = watchedEps.filter(ep => !(ep.epName === epTitle && ep.showName === showTitle))
        } else {
          updatedWatchedEpList = [...watchedEps, {epName: epTitle, showName: showTitle}]
          alert(`Watched ${epTitle}!`)
        }

        const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef, {
                watchedEps: updatedWatchedEpList
            })
    
          dispatch(showActions.updateWatchedEps(updatedWatchedEpList))
     }
    //saveNotes
    async function saveNotes(epTitle){
        const updatedNotes = {
          ...epNotes, 
          [epTitle]: draftNotes[epTitle] ?? epNotes[epTitle]}
    
        const updateCharNotes ={
          ...charNotes,
          [epTitle]: draftCharNotes[epTitle] ?? charNotes[epTitle]
        }
       
    try {
        const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef, {
                epNotes: updatedNotes,
                charNotes: updateCharNotes
            })

            if (!result.ok) {
              throw new Error(`Failed to save show: ${response.status}`)
            }
   
            dispatch(notesActions.updateEpNotes(updatedNotes))
            dispatch(notesActions.updateCharNotes(updateCharNotes))
    
        } catch (err) {
          console.error(err)
        } 
        
        //localStorage.setItem("EpNotes: " + epTitle, JSON.stringify(epNotes[epTitle] || ""))
       
        setAreNotesOpen()
    }


//userList 
    //addFriend
      async function addFriend(friendId){
        
        const updatedFriendsList = [...friendsList, friendId];
    
        try {
            const docRef = (db, "Users", "Trekkie95")
                let result = await updateDoc(docRef,{
                    friendsList: updatedFriendsList
                })
    
          if (!result.ok) {
            throw new Error("Unable to add friend.")
          }
    
          dispatch(friendsActions.addFriend(updatedUser.FriendsList))
          alert("Friend Added!")
      
        } catch (err) {
        console.log (err)
        alert(err.message);
      }
}

