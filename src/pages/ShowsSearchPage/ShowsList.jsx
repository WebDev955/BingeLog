//IMPORTS - Hooks
import { useEffect } from "react";
//IMPORTS - Components 
import Bttn from "../../components/UI/Bttn"
//IMPORT - Redux
import { useDispatch, useSelector } from "react-redux";
import { showActions } from "../../store/slices/showsSlice";

import { getDoc, setDoc, doc, db, updateDoc } from "../../firebase/firebase"




//IMPORTS - Styles
import styles from "./ShowsList.module.css"



function ShowsList({showDetails}) {
  console.log(showDetails)

  //Dispatch Functions (UPDATE STATE REDUCER FUNCTIONS)
  const dispatch = useDispatch();

  //State Slice Selectors (States to use in component)
  const userId = useSelector((state) => state.auth.user.id)
  const myShows = useSelector((state) => state.shows.myShows)
  const uid =  useSelector((state) => state.auth.user.uid);


  saveShow(showDetails)

  async function saveShow2 (showDetails){
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
    

    if (!uid) {
      console.error("No user logged in!");
      return;
    }

    const docRef = doc(db, "Users", uid);

    await updateDoc(docRef, {
      myShows: updatedShows,
    });
    
    dispatch(showActions.updateMyShows(updatedShows))
        
  }

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

      try {
          const response = await fetch(`http://localhost:3000/users/${userId}`, {
              method: "PATCH",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({myShows: updatedShows})
      })
          if (!response.ok) {
          throw new Error(`Failed to save show: ${response.status}`)
          }

          await response.json()
          dispatch(showActions.updateMyShows(updatedShows))
          //localStorage.setItem("myShows", JSON.stringify(updatedShows));
          // sync local state
      } catch (err) {
          console.error(err)
      }
  }
  
  function saveShowHandler(showDetails){
    saveShow2(showDetails)
  }

  console.log(showDetails)


  return (
    <main className={styles.showWrapper}>
      {showDetails && (
          <div key={showDetails.imdbId} className={styles.showInfo}>
            <header>
                <h2>{showDetails.title}</h2>  
                <Bttn onClick = {() => saveShowHandler(showDetails)}>Save Show</Bttn>
              </header>
              <div className={styles.showDetails}>
                <div className={styles.genres}>
                  <p>{showDetails.genres[0].name}</p>|
                  <p>{showDetails?.genres[1]?.name}</p>|
                  <p>{showDetails?.genres[2]?.name}</p>
                </div>
                <div className={styles.seasonInfo}>          
                  <p>{showDetails?.seasonCount} Seasons</p> -
                  <p>{showDetails.episodeCount} Episodes</p> 
                </div> 
            </div>
            <p>{showDetails.overview}</p>
            <img src={showDetails.imageSet.verticalPoster.w240}/>
          </div>
    )}
   </main>
  )
}
export default ShowsList