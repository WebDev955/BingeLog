import { db, app, auth, getDocs } from "../firebase/firebase";

import { authActions } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();
//Authentication
    //Login
    //Signup







//BingeLog - global users
function BingeLog() {

  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(async () => {
    getDocs(db, "Users") //grabs all Docs (user IDs)
        .then (result => result.json())
        .then (data => setGlobalUsers(data))  
  },[])
}

//FriendsList - global users search
async function addFriend(friendId){
    
    const updatedFriendsList = [...friendsList, friendId];
    
    try{
        const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef, {
                friendsList: updatedFriendsList
            })
    
        if (!result.ok) {
            throw new Error("Unable to add friend.")
        }

        dispatch(friendsActions.addFriend(updatedUser.FriendsList))
        alert("Friend Added!")
    
    } catch (err) {
    console.log (err)
    alert(err.message);
  }
}

//ShowsList - Save show
    //Save Show
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
  
  const docRef = doc(db, 'Users', "Trekkie95")
      let result = await updateDoc(docRef, {
        myShows: updatedShows
      })
  dispatch(showActions.updateMyShows(updatedShows))
}

//MyShows
    //finished show
      async function checkOffFinishedShow(showTitle, id){
        const showExists = finishedShows.some(show => show.id === id)
        let updatedFinshedShowList
    
        if (showExists){
          updatedFinshedShowList = finishedShows.filter(show => show.id !==id)
          
        } else {
          updatedFinshedShowList = [...finishedShows, {show:showTitle, id: id}]
          alert(`Finished ${showTitle}!`)
        }
        
        const docRef = doc(db, 'Users', "Trekkie95")
            let result = await updateDoc(docRef,{
                finishedShows: updatedFinshedShowList
            })

          dispatch(showActions.updateFinishedShows(updatedFinshedShowList))
      }


    //checkBinging
    async function checkOffBinging(showTitle, id){
          const showExists = currentlyBinging.some(show => show.id === id)
          let updatedBingeList
    
          if (showExists) {
            updatedBingeList = currentlyBinging.filter(show => show.id !== id)
            } else {
                updatedBingeList = [...currentlyBinging, {show:showTitle, id: id}]
            }

          const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef,{
                currentlyBinging: updatedBingeList
            })
          
        dispatch(showActions.updateBinging(updatedBingeList))
    }

//ShowNotes
    //watchedEp
    async function checkWatchedEp(epTitle, showTitle){
        const epExists = watchedEps.some(ep => 
            ep.epName === epTitle &&
            ep.showName === showTitle
          )
        let updatedWatchedEpList
    
        if (epExists){
          updatedWatchedEpList = watchedEps.filter(ep => !(ep.epName === epTitle && ep.showName === showTitle))
        } else {
          updatedWatchedEpList = [...watchedEps, {epName: epTitle, showName: showTitle}]
          alert(`Watched ${epTitle}!`)
        }

        const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef, {
                watchedEps: updatedWatchedEpList
            })
    
          dispatch(showActions.updateWatchedEps(updatedWatchedEpList))
     }
    //saveNotes
    async function saveNotes(epTitle){
        const updatedNotes = {
          ...epNotes, 
          [epTitle]: draftNotes[epTitle] ?? epNotes[epTitle]}
    
        const updateCharNotes ={
          ...charNotes,
          [epTitle]: draftCharNotes[epTitle] ?? charNotes[epTitle]
        }
       
    try {
        const docRef = doc(db, "Users", "Trekkie95")
            let result = await updateDoc(docRef, {
                epNotes: updatedNotes,
                charNotes: updateCharNotes
            })

            if (!result.ok) {
              throw new Error(`Failed to save show: ${response.status}`)
            }
   
            dispatch(notesActions.updateEpNotes(updatedNotes))
            dispatch(notesActions.updateCharNotes(updateCharNotes))
    
        } catch (err) {
          console.error(err)
        } 
        
        //localStorage.setItem("EpNotes: " + epTitle, JSON.stringify(epNotes[epTitle] || ""))
       
        setAreNotesOpen()
    }


//userList 
    //addFriend
      async function addFriend(friendId){
        
        const updatedFriendsList = [...friendsList, friendId];
    
        try {
            const docRef = (db, "Users", "Trekkie95")
                let result = await updateDoc(docRef,{
                    friendsList: updatedFriendsList
                })
    
          if (!result.ok) {
            throw new Error("Unable to add friend.")
          }
    
          dispatch(friendsActions.addFriend(updatedUser.FriendsList))
          alert("Friend Added!")
      
        } catch (err) {
        console.log (err)
        alert(err.message);
      }
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
  
  const docRef = doc(db, 'Users', "")
      let result = await updateDoc(docRef, {
        myShows: updatedShows
      })
  //dispatch(showActions.updateMyShows(updatedShows))
      
  }


export{saveShow}



  useEffect(async () => {
    getDocs(db, "Users") //grabs all Docs (user IDs)
        .then (result => result.json())
        .then (data => setGlobalUsers(data))  
  },[])


useEffect(() => {
    const token = localStorage.getItem("token"); // userId   
    
    if (token) {
      getDoc(db, "Users")
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



  async function handleSubmitAccountInfo(newUserData){
    
    const docRef = doc(db, "Users")
        let newUser = await updateDoc(docRef, {
            email: newUserData.email,
            userName: newUserData.userName,
            password: newUserData.password,
            bio: "",
            bioAvatar: null,
            friendsList: [],
            myShows: [],
            epNotes: [],
            charNotes: [],
            currentlyBinging: [],
            watchedEps: [],
            finishedShows: []
        })

        const signIn = async () =>{
          try{
            await createUserWithEmailAndPassword(auth, email, password) 
                } catch (err){
                    console.error(err)
                }
            };
        dispatch(authActions.login(newUser))
        dispatch(authActions.stopCreatingAccount())
  }



  // OLD FUNCTIONS - async-Fetch //
    const userId = useSelector((state) => state.auth.user.id)
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

    //BingeFeed - find global list 
  const dispatch = useDispatch()
  const friendsList = useSelector((state) => state.friends.friendsList)
  const [globalUsers, setGlobalUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then (res => res.json())
      .then (data => setGlobalUsers(data))
  },[])


  //log in verification 
  async function verifyLogin(userData){
      const docRef = doc(db, "Users", userId)
          await 
  
  
  
  
  
      const url = `http://localhost:3000/users?userName=${userData.userName}`;
      const response = await fetch(url);
      const users = await response.json();
       //Check if the user was found in the database (the array is not empty)
      const user = users[0];
     
      // Check if the user exists and the password matches
      if (user && user.password === userData.password) {
          localStorage.setItem("token", user.id); // setting a fake "token"
          const loginInfo = {
              id: user.id,
              userName: user.userName,
              email:user.email
          }
          handleSubmitLoginInfo(loginInfo);
          console.log(user)
          console.log(loginInfo)
          return
      } else {
          console.log("Login failed: Invalid username or password.");
          return null
      }
  }

  function handleLogin(event){
    event.preventDefault()
    const formData = new FormData(event.target)
    const userData = {
        userName: formData.get("username"),  
        password: formData.get("password"),  
    };
    
 
}

 async function addFriend(friendId){
    
    const updatedFriendsList = [...friendsList, friendId];

    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({friendsList: updatedFriendsList})
      });

      if (!response.ok) {
        throw new Error("Unable to add friend.")
      }

      const updatedUser = await response.json()
      dispatch(friendsActions.addFriend(updatedUser.FriendsList))
      alert("Friend Added!")
  
    } catch (err) {
    console.log (err)
    alert(err.message);
  }
}


    useEffect(() => {
        async function fetchUser(query){ 
            if (!query) return;
        
            const docRef = doc(db, "Users", query)


            const url = `http://localhost:3000/users?userName=${query}`
            
            const options = {
                method: "GET",
                headers: {
                    'Content-Type':"application/json"
                }
            }
            const res = await fetch(url, options);
            const data = await res.json()
            setSearchResults(data)
            console.log("Query Data", data)
        }
            fetchUser(query)

}, [query])