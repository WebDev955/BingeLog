//IMPORTS - Hooks
import { useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

//IMPORTS - Components 
import BioEdit from "./BioEdit"
import Bttn from "../../../components/UI/Bttn"
//IMPORTS - SLICES
import { profileActions } from "../../../store/slices/profileSlice"
import { authActions } from "../../../store/slices/authSlice"
import { showActions } from "../../../store/slices/showsSlice"
//IMPORTS - Styles
import styles from "./bio.module.css"
//IMPORTS - Sources
import DefaultAvatar from "../../../../public/DefaultAvatar.png"

function Bio({id}) {
  const dispatch = useDispatch()

  //DISPATCH FUNCTIONS (UPDATE STATE REDUCER FUNCTIONS)
  function toggleBioEdit(){
    dispatch(profileActions.editBio())
  }

  //State Slice Selectors 
  const userBio = useSelector((state) => state.profile.bio)
  const avatar = useSelector((state) => state.profile.profileImgUrl)
  const userName = useSelector((state) => state.auth.user.userName)
  const userId = useSelector((state) => state.auth.user.id)
  const isEditingBio = useSelector((state) => state.profile.isEditingBio)

  //const bioAvatar = useSelector((state) => state.profile.bioAvatar)
  const currentlyBinging = useSelector((state) => state.shows.currentlyBinging)
  const finishedShows = useSelector((state) => state.shows.finishedShows)
  
console.log(avatar)


    
// ADD FRIEND - pesudo code - onClick={() => userAccountCtx.addFriend(id)}
  return (
    <>
        <main className={styles.mainWrapper}>
          <div className={styles.header}>
              <Bttn className={styles.editBttn} onClick={toggleBioEdit}>Edit Bio</Bttn>
              <Bttn className={styles.editBttn}> Add Friend</Bttn>
              <img className={styles.avatar} src={avatar || "/BingeLog/DefaultAvatar.png"} width="75" height="75"/> 

              <h3>{userName}</h3>
              
              <h3>Binging since: 2025</h3> 
               <NavLink to="/friendsList"><h2>Friends List</h2></NavLink>

              {isEditingBio 
                ? <BioEdit/> 
                : <div className={styles.bioBox}>
                    {userBio}
                  </div>
              }
              
              <div className={styles.totalBinge}>
                  <h4>Shows Finished: {finishedShows.length} </h4>
                  <h4>Currently Binging: {currentlyBinging.length} shows</h4>
              </div>
          </div>
            <a href= "http://localhost:5173/userPage/${userId}" to="_blank"><h4>Share Profile Link</h4></a>
        </main>
    </>
  )
}
export default Bio