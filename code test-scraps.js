async function handleSaveReview(showId, showTitle){
        //creat new reivew object
        const newReview = {
            id: showId,
            title: showTitle,
            text: draftReview,
            createdAt: Date.now()
        }
        const updatedReviews = [...myReviews, newReview]

        try {
            const docRef = doc(db, "Users", userId)
           
            await updateDoc(docRef, {
                reviews: updatedReviews,
            });
            alert ("Review Saved!")
        } catch(err){
            console.log(err)
        }
        dispatch(showActions.updateReviews(updatedReviews))
    }   


//status 
const statuses = [{
    id: 1,
    text: "Currently binging...Recently Watched...Recently Finsihed...",
    likes: null,
    shockedReacts: null,
      chats:[{
        id:1,
        userA: "userAUserName",
        userAText: "You finsished Star Trek! How was it?",
        userBReply: "It was great!"
      }]
}]

//binging show update function 

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
  const finishedShows = useSelector((state)=> state.shows.finishedShows)
  const userId = useSelector((state) => state.auth.user.uid)
  const isReviewing = useSelector((state) => state.shows.isReviewing)
 const reviewingShowId = useSelector((state) => state.shows.reviewingShowId);
  
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

  function toggleReview(showId){
    dispatch(showActions.reviewingShow(showId));
    dispatch(showActions.toggleReviewing());
}

  function handleTitleSort(showsArr){
    const sorted = [...showsArr].sort((a,b) => 
      a.title.localeCompare(b.title)
    );
    console.log(sorted)
  dispatch(showActions.updateMyShows(sorted));
  }

  function handleBingeSort(bingeArr){
    const sorted = [...bingeArr].sort((a,b) => 
      a.show.localeCompare(b.show)
    )
    console.log(sorted)
  dispatch(showActions.updateBinging(sorted));
  }



return (
      <main {...id}className ={styles.showWrapper}>
        <div>
          <h2>Show Sorting Options</h2>
          <button onClick ={() => handleTitleSort(myShows)}>Sort by show name</button> 

        </div>
        {myShows.map((show) => (
          <div className ={styles.showTitle} key={show.imdbId}>
            <p onClick={() => handleOnClick(show.imdbId)}>{show.title}</p>

            <div className ={styles.showStatus}>
              {finishedShows &&
                <button onClick = {() => toggleReview(show.imdbId)}>Add Reveiw</button>}
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

            {isReviewing && reviewingShowId === show.imdbId && (
              <ShowReview 
                showId = {show.imdbId}
                showTitle = {show.title}
                />
            )}

            {showId === show.imdbId && 
              <ShowDetails show={show} />}
          </div> 
        ))}
      </main>
  )
}
export default MyShows
