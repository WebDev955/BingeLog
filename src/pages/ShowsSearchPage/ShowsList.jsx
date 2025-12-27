//IMPORTS - Hooks
//IMPORTS - Components 
import Bttn from "../../components/UI/Bttn"
//IMPORT - Redux
import { useDispatch, useSelector } from "react-redux";
import { showActions } from "../../store/slices/showsSlice";

import { doc, db, updateDoc } from "../../firebase/firebase"

//IMPORTS - Styles
import styles from "./ShowsList.module.css"


function ShowsList({showDetails}) {
  console.log(showDetails)

  //Dispatch Functions (UPDATE STATE REDUCER FUNCTIONS)
  const dispatch = useDispatch();

  //State Slice Selectors (States to use in component)

  const myShows = useSelector((state) => state.shows.myShows)
  const uid =  useSelector((state) => state.auth.user.uid);



  async function saveShow (showDetails){
    const showExist = myShows.some(show => show.id === showDetails.imdbId)

    if (showExist){
      alert("Show is already added in your list!")
      return
    }
    
    const addedShow = {
            id: showDetails.imdbId,
            title: showDetails.title,
            seasons: showDetails.seasons?.map((season) => ({
                title: season.title,
                episodes: season.episodes?.map((ep) => ({
                    title: ep.title,
                    isWatched: false,
                })),
            })),
            //used for show list sorting
            isBinging: false,
            isFinished: false,
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
    alert(`${showDetails.title} has been added to your list!`)   
  }

  function saveShowHandler(showDetails){
    saveShow(showDetails)
  }

  console.log(showDetails)
  
  console.log(showDetails.streamingOptions.us)


  
  //const streamingOptionSub = 
  //const streamingOptionBuy = 



  return (
    <main className={styles.showWrapper}>
      {showDetails && (
          <div key={showDetails.imdbId} className={styles.showInfo}>
            <header>
                <img src={showDetails.imageSet.horizontalPoster.w360}/>
                
              </header>
              <div className={styles.showDetails}>
                  <div>
                  <Bttn onClick = {() => saveShowHandler(showDetails)}>Save Show</Bttn>
                  </div>                
                  <div className={styles.genres}>
                    <p>{showDetails.genres[0].name}</p>|
                    <p>{showDetails?.genres[1]?.name}</p>|
                    <p>{showDetails?.genres[2]?.name}</p>
                  <div className={styles.seasonInfo}>-&nbsp;          
                    <p>{showDetails?.seasonCount} Seasons</p>
                    -&nbsp;
                    <p>{showDetails.episodeCount} Episodes</p> 
                </div>
                </div>
                <p className={styles.showOverview}>{showDetails.overview}</p>
                <hr/>
                <p>Watch Options</p>
                <div className={styles.streamingOptionsWrapper}>
                  {showDetails.streamingOptions.us?.map((option) => (
                    <div className={styles.streamingService}>
                      <p>{option.type}</p>
                        <a href={option.link} target="_blank">
                          <img src={option.service.imageSet.darkThemeImage}/>
                        </a>
                    </div>
                  ))}
                </div>
            </div>
          </div>
    )}
   </main>
  )
}
export default ShowsList