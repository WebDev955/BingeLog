//IMPORTS - Hooks
import { useEffect } from "react"
//IMPORTS - Components 
import Bttn from "../../../components/UI/Bttn"
import FileUploader from "../../../components/UI/FileUploader"
import { UserProfileContext } from "../../../components/Contexts/UserProfileContext"


//IMPORTS - SLICES
import { useDispatch, useSelector } from "react-redux"
import { profileActions } from "../../../store/slices/profileSlice"

//IMPORTS - Styles
    //import styles from FILE LOCATION


function BioEdit() {
  //Dispatch actions
  const dispatch = useDispatch()

  function onChangeHandler (e){
    dispatch(profileActions.updateBio(e))
  }  

  function saveBio(){
    // ASYNC  TO UPDATE BIO BACK END

      dispatch(profileActions.saveBio())
  }

//STATE SLICES
const bio = useSelector((state) => state.profile.bio)


  return (
    <>
        <label>Upload Avatar</label>
          <FileUploader/>
        <div>
            <textarea
              value={bio}
              onChange = {(e) => onChangeHandler(e.target.value)}
            />
            <Bttn onClick={saveBio}>Save Bio</Bttn>
        </div>
    </>
  )
}
export default BioEdit