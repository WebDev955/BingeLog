//IMPORTS - library hooks
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoStatusDebounce } from "../../../hooks/hooks";
//IMPORTS - Components
import ShowDetails from "./ShowDetails";
import ShowReview from "./ShowReview";
import ShowStatus from "./ShowStatus";
//IMPORTS - REDUX
import { showActions } from "../../../store/slices/showsSlice";
import { useDispatch, useSelector } from "react-redux";
//IMPORTS - FIREBASE/DATA
import { doc, db, updateDoc } from "../../../firebase/firebase";
//IMPORTS - STYLES/IMAGES
// import styles from "./MyShows.module.css";
import styles from "./MyShowsUPDATE.module.css";
import DownArrow from "../../../../public/DownArrow.png";
import CheckMark from "../../../../public/CheckMark.png";

function MyShows({ id }) {
  const dispatch = useDispatch();
  const triggerDebounce = useAutoStatusDebounce();
  const [showId, setShowId] = useState("");
  const [activeTab, setActiveTab] = useState("seasons");

  //Slect State from showActionSlice
  const myShows = useSelector((state) => state.shows.myShows);
  const currentlyBinging = useSelector((state) => state.shows.currentlyBinging);
  const finishedShows = useSelector((state) => state.shows.finishedShows);
  const userId = useSelector((state) => state.auth.user.uid);

  function handleSelectShow(id) {
    setShowId(id);
    setActiveTab("seasons");
    if (showId === id) {
      setShowId("");
    }
  }

  async function checkOffFinishedShow(showTitle, id) {
    const updateShowStatus = myShows.map((show) => {
      if (show.id === id) {
        return {
          ...show,
          isFinished: !show.isFinished,
        };
      }
      return show;
    });

    const showExists = finishedShows.some((show) => show.id === id);
    let updatedFinshedShowList;

    if (showExists) {
      updatedFinshedShowList = finishedShows.filter((show) => show.id !== id);
    } else {
      updatedFinshedShowList = [...finishedShows, { show: showTitle, id: id }];
      alert(`Finished ${showTitle}!`);
      triggerDebounce();
    }

    try {
      const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        finishedShows: updatedFinshedShowList,
        myShows: updateShowStatus,
      });
      dispatch(showActions.updateFinishedShows(updatedFinshedShowList));
      dispatch(showActions.updateMyShows(updateShowStatus));
    } catch (err) {
      console.error(err);
    }
  }

  async function checkOffBinging(showTitle, id) {
    //update isBinging for sorting purposes
    const updateShowStatus = myShows.map((show) => {
      if (show.id === id) {
        return {
          ...show,
          isBinging: !show.isBinging,
        };
      }
      return show;
    });

    //update currentlyBinging for live feed status
    const showExists = currentlyBinging.some((show) => show.id === id);
    let updatedBingeList;

    if (showExists) {
      updatedBingeList = currentlyBinging.filter((show) => show.id !== id);
    } else {
      updatedBingeList = [...currentlyBinging, { show: showTitle, id: id }];
      triggerDebounce();
    }

    try {
      const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        currentlyBinging: updatedBingeList,
        myShows: updateShowStatus,
      });
      dispatch(showActions.updateBinging(updatedBingeList));
      dispatch(showActions.updateMyShows(updateShowStatus));
    } catch (err) {
      console.error(err);
    }
  }

  async function removeShow(id) {
    const updatedShows = myShows.filter((show) => show.id !== id);
    const updatedBingingList = currentlyBinging.filter(
      (show) => show.id !== id,
    );
    const updatedFinshedList = finishedShows.filter((show) => show.id !== id);

    try {
      const docRef = doc(db, "Users", userId);
      await updateDoc(docRef, {
        myShows: updatedShows,
        currentlyBinging: updatedBingingList,
        finishedShows: updatedFinshedList,
      });
      dispatch(showActions.updateMyShows(updatedShows));
      dispatch(showActions.updateBinging(updatedBingingList));
      dispatch(showActions.updateFinishedShows(updatedFinshedList));
    } catch (err) {
      console.error(err);
    }
  }

  function toggleReview() {
    setActiveTab("review");
  }

  function toggleSeasons() {
    setActiveTab("seasons");
  }

  function handleTitleSort(showsArr) {
    const sorted = [...showsArr].sort((a, b) => a.title.localeCompare(b.title));
    dispatch(showActions.updateMyShows(sorted));
  }

  function handleBingeSort(showsArr) {
    const sorted = [...showsArr].sort((a, b) => b.isBinging - a.isBinging);
    dispatch(showActions.updateMyShows(sorted));
  }

  function handleFinishedSort(showsArr) {
    const sorted = [...showsArr].sort((a, b) => b.isFinished - a.isFinished);
    dispatch(showActions.updateMyShows(sorted));
  }

  return (
    <main {...id} className={styles.showDisplayWrapper}>
      <div className={styles.showSortWrapper}>
        <h4>Sort Shows: </h4>
        <div className={styles.showSortBttns}>
          <button onClick={() => handleTitleSort(myShows)}>Name</button>
          <button onClick={() => handleBingeSort(myShows)}>Binging</button>
          <button onClick={() => handleFinishedSort(myShows)}>Finished</button>
        </div>
      </div>
      <AnimatePresence>
        {myShows.map((show) => (
          <div className = {
            showId === show.id 
              ? styles.showTitleActive 
              : styles.showTitle
            }
              key={show.id}
          >
            <div onClick={() => handleSelectShow(show.id)} className={styles.showHeading}>
              <p>{show.title}</p>
              <div className={styles.showStatus}>
                {finishedShows.find((id) => id.id === show.id) && (
                  <p style={{ color: "lightgreen" }}>
                    {" "}
                    Complete <img src={CheckMark} width="20px" />
                  </p>
                )}
                {currentlyBinging.find((id) => id.id === show.id) && (
                  <p style={{ color: "yellow" }}>Binging</p>
                )}
              </div>
            </div>
            {/*Season/Show & Review Options*/}
            <AnimatePresence>
              {showId === show.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.showStatusCheckBox}>
                    <label>
                      {" "}
                      Finished
                      <input
                        type="checkbox"
                        value={show.id}
                        checked={finishedShows.some(
                          (finishedShow) => finishedShow.id === show.id,
                        )}
                        onChange={() =>
                          checkOffFinishedShow(show.title, show.id)
                        }
                      />
                    </label>
                    <label>
                      {" "}
                      Binging
                      <input
                        type="checkbox"
                        value={show.id}
                        checked={currentlyBinging.some(
                          (binge) => binge.id === show.id,
                        )}
                        onChange={() => checkOffBinging(show.title, show.id)}
                      />
                    </label>
                    <label>
                      {" "}
                      Watch Que
                      <input type="checkbox" />
                    </label>
                    <button onClick={() => removeShow(show.id)}>
                      Remove Show
                    </button>
                  </div>
                  <div className={styles.showOptionsWrapper}>
                    <p onClick={toggleSeasons}>Seasons & Episodes</p>
                    <p onClick={toggleReview}>Review</p>
                  </div>

                  {activeTab === "review" ? (
                    <ShowReview showId={show.id} showTitle={show.title} />
                  ) : (
                    <ShowDetails show={show} animate={{ y: 3 }} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </AnimatePresence>
    </main>
  );
}
export default MyShows;
