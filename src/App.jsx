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


  //NAVIGATION
  import RootLayout from './components/UI/RootLayout'

//IMPORTS - REDUX
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/slices/authSlice'
import { showActions } from "./store/slices/showsSlice";
import { notesActions } from './store/slices/notesSlice'
import { friendsActions } from './store/slices/friendsSlice'
import { profileActions } from './store/slices/profileSlice'



//{path: `friendsList/:userName/:id`, element: <FriendsList/>},
  //THIS IS AN ISSUE



//IMPORTS - Styles
import './App.css'


function App() {

const dispatch = useDispatch();
const myShows = useSelector((state) => state.shows.myShows)
const isUserLoggedIn = useSelector((state) => state.loggedIn)

  useEffect(() => {
    const token = localStorage.getItem("token"); // userId

    if (token) {
      // Fetch the user object by id
      fetch(`http://localhost:3000/users/${token}`)
        .then(res => res.json())
        .then(user => {
          if (!user) return;

          // Hydrate authSlice with essentials
          dispatch(authActions.login({
            id: user.id,
            userName: user.userName,
            email: user.email
          }));
          
          //Hydrate bioSlice
          dispatch(profileActions.uploadAvatar(user.bioAvatar))
          dispatch(profileActions.updateBio(user.bio))

          // Hydrate showsSlice with myShows
          dispatch(showActions.updateMyShows(user.myShows || []));

          // Hydrate showsSlice with currentlyBinging
          dispatch(showActions.updateBinging(user.currentlyBinging || []))

          // Hydrate showsSlice with finishedShows
          dispatch(showActions.updateFinishedShows(user.finishedShows || []))

          // Hydrate showsSlice with finishedShows
          dispatch(showActions.updateWatchedEps(user.watchedEps || []))

          // Hydrate notesSlice with epNots
          dispatch(notesActions.updateEpNotes(user.epNotes || []))

          // Hydrate notesSlice with charNotes
          dispatch(notesActions.updateCharNotes(user.charNotes || []))

          // Hydrate friendsSlice with friendsList
          dispatch(friendsActions.addFriend(user.friendsList || []))

        })
        .catch(err => console.error("Auth restore failed:", err));
    }
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
