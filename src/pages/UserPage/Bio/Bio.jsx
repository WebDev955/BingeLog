//IMPORTS - Hooks
import { useContext, useEffect, useState } from "react"
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
import AddFriend from "../../../../public/AddFriend.png"
import EditProfile from "../../../../public/EditProfile.png"
import FriendList from "../../../../public/FriendList.png"
import Share from "../../../../public/Share.png"

function Bio({id}) {
  
  const [isEditingBio, setIsEditingBio] = useState(false)
  
  const dispatch = useDispatch()

  //DISPATCH FUNCTIONS (UPDATE STATE REDUCER FUNCTIONS)
  function toggleBioEdit(){
    dispatch(profileActions.editBio())
  }

  function editingBio(){
    setIsEditingBio(true)

    if (isEditingBio) {
      setIsEditingBio(false)
    }
  }


  //State Slice Selectors 
  const userBio = useSelector((state) => state.profile.bio)
  const avatar = useSelector((state) => state.profile.profileImgUrl)
  const userName = useSelector((state) => state.auth.user.userName)
  const userId = useSelector((state) => state.auth.user.id)
  //const isEditingBio = useSelector((state) => state.profile.isEditingBio)

  //const bioAvatar = useSelector((state) => state.profile.bioAvatar)
  const currentlyBinging = useSelector((state) => state.shows.currentlyBinging)
  const finishedShows = useSelector((state) => state.shows.finishedShows)
  
    
// ADD FRIEND - pesudo code - onClick={() => userAccountCtx.addFriend(id)}
  return (
    <>
        <main className={styles.mainWrapper}>
          <div className={styles.header}>
            <div className={styles.bioBttnMenu}>
              <img  onClick={() => editingBio()} src= {EditProfile} width = "35px"/>        
                {isEditingBio === true && <label>Close Editing</label>}
              <img src= {AddFriend} width = "35px"/>  
               <NavLink to="/friendsList"><img src= {FriendList} width = "35px"/></NavLink>    
              <a href= "http://localhost:5173/userPage/${userId}" to="_blank"><img src= {Share} width = "35px"/></a>
            </div>
              <img className={styles.avatar} src={avatar || "/BingeLog/DefaultAvatar.png"} width="75" height="75"/>
              <h3>{userName}</h3>
              <h3>Binging since: 2025</h3> 
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
        </main>
    </>
  )
}
export default Bio