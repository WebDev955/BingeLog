//IMPORTS - Hooks
import { createHashRouter, RouterProvider} from 'react-router-dom'
import { useEffect } from 'react'

//IMPORTS - Components 
import HomePage from './pages/Home/HomePage'
import UserPage from './pages/UserPage/UserPage'
import ShowsPage from './pages/ShowsSearchPage/ShowsPage'
import BingeLogPage from './pages/BingeLogFeed/BingeLogPage'
import About from './pages/About/About'
import FriendsList from './pages/FriendsList/FriendsList'
import UserSearchPage from './pages/UserSearch/UserSearchPage'

import { auth } from './firebase/firebase'
import {db, getDoc, setDoc, doc} from './firebase/firebase'


  //NAVIGATION
  import RootLayout from './components/UI/RootLayout'

//IMPORTS - REDUX
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/slices/authSlice'
import { showActions } from "./store/slices/showsSlice";
import { notesActions } from './store/slices/notesSlice'
import { friendsActions } from './store/slices/friendsSlice'
import { profileActions } from './store/slices/profileSlice'
import { onAuthStateChanged } from "./firebase/firebase"



//{path: `friendsList/:userName/:id`, element: <FriendsList/>},
  //THIS IS AN ISSUE

 

//IMPORTS - Styles
import './App.css'
import { current } from '@reduxjs/toolkit'


function App() {

const dispatch = useDispatch();
const myShows = useSelector((state) => state.shows.myShows)
const isUserLoggedIn = useSelector((state) => state.auth.isLoggedIn)

//auth.currentUser;  - can be null after a refresh

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) return;

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
        dispatch(profileActions.uploadAvatar(user.bioAvatar));
        dispatch(profileActions.updateBio(user.bio));

        // Hydrate showSlice
        dispatch(showActions.updateMyShows(user.myShows || []));
        dispatch(showActions.updateBinging(user.currentlyBinging || []));
        dispatch(showActions.updateFinishedShows(user.finishedShows || []));
        dispatch(showActions.updateWatchedEps(user.watchedEps || []));

        // Hydrate notesSlice
        dispatch(notesActions.updateEpNotes(user.epNotes || []));
        dispatch(notesActions.updateCharNotes(user.charNotes || []));

        // Hydrate friendsSlice
        dispatch(friendsActions.addFriend(user.friendsList || []));
      }
    } catch (err) {
      console.error("Auth restore failed:", err);
    }
  });

  return () => unsubscribe;
}, [dispatch]);

const router = createHashRouter([
  {
    path:'/',
    element: <RootLayout/>,
      children: [ 
        {index: true, element: <HomePage/>},
        {path: `userPage/:id`, element: <UserPage/>},
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
