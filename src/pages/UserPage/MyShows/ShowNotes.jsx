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
//import { authActions } from "../../../store/slices/authSlice"

import { db, doc, updateDoc} from "../../../firebase/firebase"

function ShowNotes({epTitle, showTitle}) {
  //Selecting Redux State 
  
  const dispatch = useDispatch()
  const userId = useSelector((state)=> state.auth.user.uid)
  const epNotes = useSelector((state) => state.notes.epNotes)
  const charNotes = useSelector((state) => state.notes.charNotes)
  const watchedEps = useSelector((state) => state.shows.watchedEps)

/**Editing Episode Notes**/

//const [isEditingEpNotes, setIsEditingEpNotes]  = useState()
const [draftNotes, setDraftNotes] = useState({})
const [draftCharNotes, setDraftCharNotes] = useState({})

/* Are Notes open? */
const [areNotesOpen, setAreNotesOpen] = useState()

/* Are Notes Being Viewed? */
const [isViewingNotes, setIsViewingNotes] = useState()
  
function openNotes(epTitle){
      setAreNotesOpen(epTitle)
  }


function updateEpNotes(value, epTitle){
    setDraftNotes((prev) => ({
        ...prev,
        [epTitle]:value
    }))
}

function updateCharNotes(value, epTitle){
    setDraftCharNotes((prev) => ({
        ...prev,
        [epTitle]:value
    }))
}


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
 }

 async function saveNotes(epTitle){
    const updatedNotes = {
      ...epNotes, 
      [epTitle]: draftNotes[epTitle] ?? epNotes[epTitle]
    }

    const updatedCharNotes = {
      ...charNotes,
      [epTitle]: draftCharNotes[epTitle] ?? charNotes[epTitle]
    }
    
    try { 
          const docRef = doc(db, "Users", userId)

            await updateDoc(docRef, {
              epNotes: updatedNotes ||"",
              charNotes: updatedCharNotes || ""
        })
        dispatch(notesActions.updateEpNotes(updatedNotes))
        dispatch(notesActions.updateCharNotes(updatedCharNotes))
    } catch (err) {
      console.error(err)
    } 
    setAreNotesOpen()
}
  
  function displayNotes(epTitle){
    setIsViewingNotes(epTitle)
  }

  function closeNotes(){
    setIsViewingNotes()
  }
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("EpNotes: " +  epTitle))
    if (saved) {
      updateEpNotes(saved, epTitle)
    }
  }, [epTitle])


  return (
    <main className={styles.showNotesWrapper}>
      <div className={styles.noteBttnsDiv}>
        
        {areNotesOpen === epTitle 
          ? ( <Bttn className = {styles.saveNotesBttn} onClick={() => saveNotes(epTitle)}>Save Notes</Bttn>)
          : ( <Bttn className = {styles.editBttn} onClick={() => openNotes(epTitle)}>Edit Notes</Bttn>)
       } 
        {areNotesOpen !==epTitle && isViewingNotes === epTitle  
          ? (<Bttn className={styles.closeNotesBttn} onClick = {() => closeNotes()}>Close Notes</Bttn>)
          : (<Bttn className={styles.viewNotesBttn}  onClick = {() => displayNotes(epTitle)}>View Notes</Bttn>)
        } 
        <Input 
          label="Watched" 
          type="checkbox"
          value = {epTitle}
          checked = { 
                    watchedEps.some(
                      watchedEp => 
                        watchedEp.epName === epTitle  &&
                        watchedEp.showName === showTitle
                  )}
          onChange = {() => checkWatchedEp(epTitle, showTitle)}
           />
      </div>

        {areNotesOpen === epTitle && (
          <div>
            <p>Episode Notes</p> 
              <textarea
                value={draftNotes[epTitle] ?? epNotes[epTitle]}
                onChange={(e)=> updateEpNotes(e.target.value, epTitle)}
            /> 
            <p>Character Notes</p> 
              <textarea
                value={draftCharNotes[epTitle] ?? charNotes[epTitle]}
                onChange={(e)=> updateCharNotes(e.target.value, epTitle)}
            />             
        </div>
        
        )}  

        {isViewingNotes === epTitle && (
              <div className={styles.showNotes}>
                <p>Episode Notes </p>
                {epNotes[epTitle]}
                <hr/>
                <p>CharacterNotes</p>
                {charNotes[epTitle]}
            </div>
             )}
  </main>
  )
}  
export default ShowNotes