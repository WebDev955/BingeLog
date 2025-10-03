//IMPORTS - Hooks
import { useState } from "react"
//IMPORTS - Components 
import Bttn from "../../../components/UI/Bttn";
import ShowDetails from "./ShowDetails"
//IMPORTS - REDUX
import { showActions } from "../../../store/slices/showsSlice";
import { useDispatch, useSelector } from "react-redux";

//IMPORTS - Styles
import styles from "./MyShows.module.css"
import ShowReview from "./ShowReview";
import { getDoc, setDoc, doc, db, updateDoc } from "../../../firebase/firebase"

function MyShows({id}) {
  const dispatch = useDispatch()
  const [showId, setShowId] = useState("")

  //Slect State from showActionSlice
  const myShows = useSelector((state) => state.shows.myShows)

  const currentlyBinging = useSelector((state) => state.shows.currentlyBinging)
  const finishedShows= useSelector((state)=> state.shows.finishedShows)
  const userId = useSelector((state) => state.auth.user.uid)
  

  function handleOnClick(id){
      setShowId(id)

    if (showId === id){
      setShowId("")
    }
  }


  async function checkOffFinishedShow(showTitle, id){
    const showExists = finishedShows.some(show => show.id === id)
    let updatedFinshedShowList

    if (showExists){
      updatedFinshedShowList = finishedShows.filter(show => show.id !==id)
      
    } else {
      updatedFinshedShowList = [...finishedShows, {show:showTitle, id: id}]
      alert(`Finished ${showTitle}!`)
    }

    try {
        const docRef = doc(db, 'Users', userId)
          await updateDoc(docRef, {
            finishedShows: updatedFinshedShowList
          })

      dispatch(showActions.updateFinishedShows(updatedFinshedShowList))
      
    } catch (err){
      console.log(err)
    }

  }

  async function checkOffBinging(showTitle, id){
      const showExists = currentlyBinging.some(show => show.id === id)
      let updatedBingeList

      if (showExists) {
        updatedBingeList = currentlyBinging.filter(show => show.id !== id)
      } else {
        updatedBingeList = [...currentlyBinging, {show:showTitle, id: id}]
      }
      
      try {
          const docRef = doc(db, 'Users', userId)
            await updateDoc(docRef, {
              currentlyBinging: updatedBingeList
            })
   
        dispatch(showActions.updateBinging(updatedBingeList))
    
      } catch (err) {
          console.error(err)
      }
  }

  function toggleReview(){
    dispatch(showActions.startReviewing())
}

return (
      <main {...id}className ={styles.showWrapper}>
        <h2>Show Sorting Options </h2>
        {myShows.map((show) => (
          <div className ={styles.showTitle} key={show.imdbId}>
            <p onClick={() => handleOnClick(show.imdbId)}>{show.title}</p>
            <div className ={styles.showStatus}>
              <ShowReview show = {show}/>
              <label> Finished
                <input 
                  type="checkbox" 
                  value={show.imdbId}
                  checked = {finishedShows.some(finishedShow => finishedShow.id === show.imdbId)}
                  onChange = {() => checkOffFinishedShow(show.title, show.imdbId)}
                />
              </label> || 
              <label> Currently Binging
                <input 
                  type="checkbox"
                  value = {show.imdbId}
                  checked ={currentlyBinging.some(binge => binge.id === show.imdbId)}
                  onChange={() => checkOffBinging(show.title, show.imdbId)}
                />
              </label>
            </div>
            {showId === show.imdbId && 
              <ShowDetails show={show} />}
          </div> 
        ))}
       
      </main>
  )
}
export default MyShows
