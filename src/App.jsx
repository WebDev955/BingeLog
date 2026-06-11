//IMPORTS - HOOKS
import { createHashRouter, RouterProvider} from 'react-router-dom'
import { useEffect, useState } from 'react'
//IMPORTS - COMPONENTS
import HomePage from './pages/Home/HomePage'
import UserPage from './pages/UserPage/UserPage'
import ShowsPage from './pages/ShowsSearchPage/ShowsPage'
import BingeLogPage from './pages/BingeLogFeed/BingeLogPage'
import About from './pages/About/About'
import FriendsList from './pages/FriendsList/FriendsList'
import UserSearchPage from './pages/UserSearch/UserSearchPage'
// IMPORTS - FIREBASE
import {db, getDoc, doc, query, where, getDocs, collection, auth, QuerySnapshot} from './firebase/firebase'

import { onAuthStateChanged } from "./firebase/firebase"
//IMPORTS - NAVIGATION
import RootLayout from './components/UI/RootLayout'
//IMPORTS - REDUX
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/slices/authSlice'
import { showActions } from "./store/slices/showsSlice";
import { notesActions } from './store/slices/notesSlice'
import { friendsActions } from './store/slices/friendsSlice'
import { profileActions } from './store/slices/profileSlice'
import { socialFeedActions } from './store/slices/socialFeedSlice'
import { chatsActions } from './store/slices/chatsSlice'


//IMPORTS - STYLES
import './App.css'
import { current } from '@reduxjs/toolkit'
import { snapshotEqual } from 'firebase/firestore'

//{path: `friendsList/:userName/:id`, element: <FriendsList/>},
  //THIS IS AN ISSUE
function App() {

const dispatch = useDispatch();
const myShows = useSelector((state) => state.shows.myShows)
const isUserLoggedIn = useSelector((state) => state.auth.isLoggedIn)
//auth.currentUser;  - can be null after a refresh

const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      setHydrated(true)
      return;
    }

    try {
      const docRef = doc(db, "Users", currentUser?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user = docSnap.data();
      // Hydrate authSlice
        dispatch(authActions.login({
          uid: currentUser.uid,
          userName: user.userName,
          email: user.email
        }));
      // Hydrate profileSlice
        dispatch(profileActions.uploadAvatar(user.profileImgUrl || "/BingeLog/DefaultAvatar.png"));
        dispatch(profileActions.updateBio(user.bio));
      // Hydrate showSlice
        dispatch(showActions.updateMyShows(user.myShows || []));
        dispatch(showActions.updateBinging(user.currentlyBinging || []));
        dispatch(showActions.updateFinishedShows(user.finishedShows || []));
        dispatch(showActions.updateWatchedEps(user.watchedEps || []));
        dispatch(showActions.updateReviews(user.reviews || []));
      // Hydrate notesSlice
        dispatch(notesActions.updateEpNotes(user.epNotes || []));
        dispatch(notesActions.updateCharNotes(user.charNotes || []));
      // Hydrate friendsSlice
        dispatch(friendsActions.addFriend(user.friendsList || []));
         // Hydrate socialFeedSlice with Friends statuses 
          const friendsList = user.friendsList || []
          if (friendsList.length > 0){
            const autoStatusesRef = collection(db, "autoStatuses")
            const q = query(autoStatusesRef, where("userId", "in", friendsList))
            const querySnapshot = await getDocs(q)
            const friendsListAutoStatuses = querySnapshot.docs.map(doc => doc.data())
            dispatch(socialFeedActions.updateAutoStatuses(friendsListAutoStatuses || []))
          }

          // Hydrate chatsSlice data
          const findThreads = query(
            collection(db, "chatThreads"),
            where("commentingUsers", "array-contains", currentUser.uid)
          )
            const snapshot = await getDocs(findThreads)
    
            const threads = snapshot.docs.map(doc => ({
              ...doc.data(),
              threadId: doc.id 
            }))

          const threadsWithComments = await Promise.all(
            threads.map(async (thread) => {
              const commentsRef = collection(db, "chatThreads", thread.threadId, "comments")
              const commentsSnapshot = await getDocs(commentsRef)
              const comments = commentsSnapshot.docs.map(doc => ({
                ...doc.data(),
                commentId: doc.id
              }))
              return { ...thread, comments }
          })
        )

        console.log("threads raw:", threads);
        console.log("threadsWithComments:", threadsWithComments);
      dispatch(chatsActions.updateChatThreads(threadsWithComments))
  }

      
    } catch (err) {
      console.error("Auth restore failed:", err);

    } finally {
      setHydrated(true)
    }
  });

    return () => unsubscribe();
}, [dispatch]);

  if (!hydrated) {
    return <div>Loading...</div>;
  }
  
const router = createHashRouter([
  {
    path:'/',
    element: <RootLayout/>,
      children: [ 
        {index: true, element: <HomePage/>},
        {path: `userPage/:uid`, element: <UserPage/>},
        {path: "friendsList", element: <FriendsList/>},
        {path: "bingelog", element: <BingeLogPage/>},
        {path: "userSearch", element: <UserSearchPage/>},
        {path: "shows", element: <ShowsPage/>},
        {path: "about", element: <About/>}

      ]
  },
])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}
export default App
