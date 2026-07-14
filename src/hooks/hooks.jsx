//IMPORTS - Hooks
import { useEffect, useRef } from "react";
//IMPORTS - FIRESTORE
import { db, collection, addDoc, auth } from "../firebase/firebase";
//IMPORTS - SLICES
import { useDispatch, useSelector } from "react-redux";
import { socialFeedActions } from "../store/slices/socialFeedSlice";
import { profileActions } from "../store/slices/profileSlice";
import { authActions } from "../store/slices/authSlice";

export const useAutoStatusDebounce = () => {
  const dispatch = useDispatch();
  const currBinging = useSelector((state) => state.shows.currentlyBinging);
  const finishedShows = useSelector((state) => state.shows.finishedShows);
  const watchedEps = useSelector((state) => state.shows.watchedEps);
  const userId = useSelector((state) => state.auth.user.uid);
  const userImage = useSelector((state) => state.profile.profileImgUrl);
  const userName = useSelector((state) => state.auth.user.userName);

  const timerRef = useRef(null);
  const scheduleRef = useRef(null);

  function triggerDebounce() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      scheduleRef.current();
    }, 500);
  }
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  async function scheduleAutoStatus() {
    const newAutoStatus = {
      userId: userId,
      userName: userName,
      userImage: userImage,
      statusId: crypto.randomUUID(),
      timeStamp: new Date().getTime(),
      statusPost: {
        currBinging:
          currBinging.length > 0
            ? currBinging.slice(0, 5)
            : `${userName} isn't binging anything.`,
        recentlyWatched:
          watchedEps.length > 0
            ? `${watchedEps[watchedEps.length - 1].epName} - 
                        ${watchedEps[watchedEps.length - 1].showName}`
            : `${userName} hasn't watched anything recently.`,
        recentlyFinished: finishedShows[finishedShows.length - 1] ?? null,
      },
    };
    try {
      const autoStatusRef = collection(db, "autoStatuses");
      await addDoc(autoStatusRef, newAutoStatus);
      dispatch(socialFeedActions.addAutoStatus(newAutoStatus));
    } catch (err) {
      console.error("Write Faild:", err);
    }
  }

  scheduleRef.current = scheduleAutoStatus;
  return triggerDebounce;
};
