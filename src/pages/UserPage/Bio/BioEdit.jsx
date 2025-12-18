//IMPORTS - Hooks
import { useEffect, useState } from "react"
import {db, doc, updateDoc} from "../../../firebase/firebase"
//IMPORTS - Components 
import Bttn from "../../../components/UI/Bttn"
import FileUploader from "../../../components/UI/FileUploader"
import { UserProfileContext } from "../../../components/Contexts/UserProfileContext"

import styles from "../Bio/BioEdit.module.css"

//IMPORTS - SLICES
import { useDispatch, useSelector } from "react-redux"
import { profileActions } from "../../../store/slices/profileSlice"

//IMPORTS - Styles
    //import styles from FILE LOCATION





function BioEdit() {
  const [bioDraft, setBioDraft] = useState()
  const [isEditingBio, setIsEditingBio] = useState(false)


  //STATE SLICES
  const dispatch = useDispatch()
  const bio = useSelector((state) => state.profile.bio)  
  const userId = useSelector(state => state.auth.user.uid);


  function editBioHandler() {
    setIsEditingBio(true)
    console.log(isEditingBio)
  }
    
  
  function updateBio (value){
    setBioDraft(value)
  }


  async function saveBio(){
    const newBio = bioDraft

    const docRef = doc(db, "Users", userId)
    await updateDoc(docRef, {
      bio: newBio
    },
    dispatch(profileActions.updateBio(newBio))
    
  )
  alert("Bio Saved!")
  setIsEditingBio(false) 
}

  return (
    <>
        <label>Upload Avatar</label>
          <FileUploader/>
        <div>
          {bio}
          {isEditingBio && (
            <textarea className={styles.bioTextBox}
              value={bioDraft ?? bio }
              onChange = {(e) => updateBio(e.target.value)}
            />
          )}
            
            <Bttn onClick={() => editBioHandler()}>Edit Bio</Bttn>
            <Bttn onClick={() => saveBio()}>Save Bio</Bttn>
        </div>
    </>
  )
}
export default BioEdit