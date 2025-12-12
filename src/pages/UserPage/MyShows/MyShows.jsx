//IMPORTS - 
import { useState } from "react";
import {motion, AnimatePresence} from 'framer-motion'
//IMPORTS - Components 

import ShowDetails from "./ShowDetails"
//IMPORTS - REDUX
import { showActions } from "../../../store/slices/showsSlice";
import { useDispatch, useSelector } from "react-redux";

//IMPORTS - Styles
import styles from "./MyShows.module.css"
import ShowReview from "./ShowReview";
import { doc, db, updateDoc } from "../../../firebase/firebase"

function MyShows({id}) {
  const dispatch = useDispatch()
  const [showId, setShowId] = useState("")

  //Slect State from showActionSlice
  const myShows = useSelector((state) => state.shows.myShows)
  const currentlyBinging = useSelector((state) => state.shows.currentlyBinging)
  const finishedShows = useSelector((state)=> state.shows.finishedShows)
  const userId = useSelector((state) => state.auth.user.uid)
  const isReviewing = useSelector((state) => state.shows.isReviewing)
  const reviewingShowId = useSelector((state) => state.shows.reviewingShowId);
  
  function handleSelectShow(id){
      setShowId(id)

    if (showId === id){
      setShowId("")
    }
  }

  async function checkOffFinishedShow(showTitle, id){
    const updateShowStatus = myShows.map(show => {
      if (show.id === id){
        return {
          ...show,
          isFinished: !show.isFinished
        };
      }
      return show;
    })
    
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
            finishedShows: updatedFinshedShowList,
            myShows: updateShowStatus
          })

      dispatch(showActions.updateFinishedShows(updatedFinshedShowList))
      dispatch(showActions.updateMyShows(updateShowStatus))
      
    } catch (err){
      console.log(err)
    }

  }

  async function checkOffBinging(showTitle, id){
      //update isBinging for sorting purposes
      const updateShowStatus = myShows.map(show => {
        if (show.id === id) {
          return {
            ...show,
            isBinging: !show.isBinging
          };
        }
      return show;
    })
    
      //update currentlyBinging for live feed status 
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
              currentlyBinging: updatedBingeList,
              myShows: updateShowStatus
            })
        dispatch(showActions.updateBinging(updatedBingeList))
        dispatch(showActions.updateMyShows(updateShowStatus))
    
      } catch (err) {
          console.error(err)
      }
  }

  async function removeShow(id){
    const updatedShows = myShows.filter(show => show.id !== id)
    const updatedBingingList = currentlyBinging.filter(show => show.id !==id)
    const updatedFinshedList = finishedShows.filter(show => show.id !== id )

    try { 
      const docRef = doc(db, 'Users', userId)
        await updateDoc(docRef, {
          myShows: updatedShows,
          currentlyBinging: updatedBingingList,
          finishedShows: updatedFinshedList
        })
      dispatch(showActions.updateMyShows(updatedShows))
      dispatch(showActions.updateBinging(updatedBingingList))
      dispatch(showActions.updateFinishedShows(updatedFinshedList))
    } catch (err) {
      console.error(err)
    }
    console.log(updatedShows)
    console.log(updatedBingingList)
    console.log(updatedFinshedList)
  }


  function toggleReview(showId){
    dispatch(showActions.reviewingShow(showId));
    dispatch(showActions.toggleReviewing());
}

  function handleTitleSort(showsArr){
    const sorted = [...showsArr].sort((a,b) => 
      a.title.localeCompare(b.title)
    );
  dispatch(showActions.updateMyShows(sorted));
  }

  function handleBingeSort(showsArr){
    const sorted = [...showsArr].sort((a,b) => 
      (b.isBinging - a.isBinging)
    )  
    dispatch(showActions.updateMyShows(sorted));
  }
  
  function handleFinishedSort(showsArr){
    const sorted = [...showsArr].sort((a,b)=>
    (b.isFinished - a.isFinished)
    )
    dispatch(showActions.updateMyShows(sorted));
  }
  
return (

      <main {...id}className ={styles.showWrapper}>
        <div>
          <h2>Show Sorting Options</h2>
          <button onClick ={() => handleTitleSort(myShows)}>Sort by show name</button> --- 
          <button onClick ={() => handleBingeSort(myShows)}>Sort by binge status</button> ---
          <button onClick ={() => handleFinishedSort(myShows)}>Sort by finished status</button>   
        </div>
        <AnimatePresence>
        {myShows.map((show) => (
          <div className ={styles.showTitle} key={show.id}>
            <p onClick={() => handleSelectShow(show.id)}>{show.title}</p>

            <div className ={styles.showStatus}>
              <button onClick = {() => toggleReview(show.id)}>Add Review</button> <br/>  
              <button onClick = {() => removeShow(show.id)}>Remove Show</button> <br/>
              <label> Finished
                <input 
                  type="checkbox" 
                  value={show.id}
                  checked = {finishedShows.some(finishedShow => finishedShow.id === show.id)}
                  onChange = {() => checkOffFinishedShow(show.title, show.id)}
                />
              </label> || 
              <label> Currently Binging
                <input 
                  type="checkbox"
                  value = {show.id}
                  checked = {currentlyBinging.some(binge => binge.id === show.id)}
                  onChange={() => checkOffBinging(show.title, show.id)}
                />
              </label>
            </div>
            {isReviewing && reviewingShowId === show.id && (
              <ShowReview 
                showId = {show.id}
                showTitle = {show.title}
                />
            )}
            <AnimatePresence>
            {showId === show.id && (
               <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
              <ShowDetails 
                show={show}
                animate={{y: 3}}
              />
              </motion.div>
            )}
            </AnimatePresence>
          </div> 
        ))}
        </AnimatePresence>
      </main>
  )
}
export default MyShows
