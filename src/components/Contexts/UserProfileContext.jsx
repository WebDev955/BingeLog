import {createContext, use, useEffect, useState, useContext} from "react";
import CurrentlyWatching from "../../pages/UserPage/CurrentlyWatching/CurrentlyWatching";

import { UserAccountContext } from "./UserAccountContext";


//Create Context - JUST A TEMPLATE / DEFAULT VALUES
//NOTE STATES OR HOOKS
export const UserProfileContext = createContext({

/**** USER PROFILE ACTIONS AND STATES *****/

/* 1. userAccount imports */

/* 2. Bio */
bio: [],
editingBio: [false],
updateBio: () => {},
editBio: () => {},
saveBio: () => {},

bioAvatar: [],
uploadAvatar: () => {},

/* 3. Favorite Shows */
myShows: [],
saveShow:() => {},
displayShows: () => {},

/* 4 Reviews */

/* 5 Currently Watching */
currentlyBinging: [],
binging: () => {},
bingingChecked: [],

/* 6 Show Notes */
areNotesOpen: [],
openNotes: () => {},

/* Episode Notes */
isEditingEpNotes:[], 
editEpNotes: () => {}, 
updateEpNotes: () =>{},
saveNotes: () => {},
epNotes: [],

/* Character Notes */
isEditingCharNotes:[], 
editCharNotes: () => {}, 
updateCharNotes: () =>{},
saveCharNotes: () => {},
characterNotes: [],




//isEditingCharacterNotes: [],
//characterNotes: [],
//editCharacterNotes: () => {},
//updateCharacterNotes: () =>{},
//saveCharacterNotes: () => {}

});

/*******************************CONTEXT PROVIDER********************************************/
//Only in Provider is where you create/use functions and estbalish/change state

export function UserProfileContextProvider({children}){
    
/****User Account Info*****/

const userAcct = useContext(UserAccountContext)


/**********************
 BIO EDITING
***********************/

//State - is userEditing bio? 
const [bio, setBio] = useState("Set a bio here!");
const [editingBio, setEditingBio] = useState(false);
const [bioAvatar, setBioAvatar] = useState("/DefaultAvatar.jpg")

//Functions- save/update Note 
function editBio(){
    setEditingBio(true)
}

function updateBio(e){
    setBio(e)
}

function saveBio(){
    localStorage.setItem("Bio", JSON.stringify(bio))
    localStorage.setItem("AvatarImg", JSON.stringify(bioAvatar))
    setEditingBio(false)
}

function uploadAvatar(e){
    const file = e.target.files[0] // grab first selected file
    if (file){
        const previewUrl = URL.createObjectURL(file);
        setBioAvatar(previewUrl)
    }
}
 
//pulling from localStorage
useEffect(() => {
    const storedBio = JSON.parse(localStorage.getItem("Bio"))
    if (storedBio){
        setBio(storedBio)
    };
    const storedAvatar = JSON.parse(localStorage.getItem("AvatarImg"))
    if (storedAvatar) {
        setBioAvatar(storedAvatar)
    }
},[])

/**********************
    FAVORITE SHOWS
***********************/
const [myShows, setMyShows] = useState([])

function displayShows(savedShows){
    setMyShows(savedShows)
}

async function saveShow (show){
    if (!userAcct?.userAccount?.id) return;

    const addedShow = {
        imdbId: show.imdbId,
        title: show.title,
        seasons: show.seasons?.map((season) => ({
            title: season.title,
            episodes: season.episodes?.map((ep) => ({
                title: ep.title
            }))
        }))
    }
    const updatedShows = [...myShows, addedShow]

    try {
        const response = await fetch(`http://localhost:3000/users/${userAcct.userAccount.id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({myShows: updatedShows})
    })
        if (!response.ok) {
        throw new Error(`Failed to save show: ${response.status}`)
        }

        await response.json()
        userAcct.userAccount(prev => ({...prev, myShows: updatedShows}))
        localStorage.setItem("user", JSON.stringify({ ...userAcct.userAccount, myShows: updatedShows }));
          // sync local state
    } catch (err) {
        console.error(err)
    }
}
 
// On login, load shows either from localStorage or from userAccount
useEffect(()=> {
  if (userAcct?.userAccount?.myShows.length) 
      setMyShows(userAcct.userAccount.myShows);
  }, [userAcct]);


    
/**********************
    CURRENTLY WATCHING
***********************/
const [currentlyBinging, setCurrentlyBinging] = useState([])
const [bingingChecked, setBingingChecked] = useState([])

function binging(title, id){
    setCurrentlyBinging(prev => { 
        if (title === currentlyBinging.find((title) => title)) {   
            return
       }
        const updated = [...prev, title]
        localStorage.setItem("CurrBinging", JSON.stringify(updated))
        return updated
    })
    setBingingChecked(prev => [...prev, id])
}

useEffect(()=> {
    const storedBinging = JSON.parse(localStorage.getItem("CurrBinging"))
    if (storedBinging) {
        setCurrentlyBinging(storedBinging)
    }
}, [])

/**********************
  Episode and Character Notes
***********************/

/* Are Notes open? */
const [areNotesOpen, setAreNotesOpen] = useState()

function openNotes(id){
    setAreNotesOpen(id)
}

/**Editing Episode Notes**/
const [isEditingEpNotes, setIsEditingEpNotes]  = useState()
const [eNotes, setEpNotes] = useState({})

function editEpNotes(id){
    setIsEditingEpNotes(id)
}

function updateEpNotes(value, id){
    setEpNotes((prev) => ({
        ...prev,
        [id]:value
    }))
}

function saveNotes(id){
    localStorage.setItem("EpNotes: " + id, JSON.stringify(epNotes[id] || ""))
    localStorage.setItem("CharNotes: " + id, JSON.stringify(characterNotes[id] || ""))
    setIsEditingEpNotes(false)
    setIsEditingCharNotes(false)
    setAreNotesOpen()
}

//useEffect((showTitle, epTitle)=> {
    //const storedEpNotes = epNotes.forEach((note) => setEpNotes(note)) 
    //JSON.parse(localStorage.getItem("EpNotes:" + showTitle + epTitle))
    //if (storedEpNotes) {
       /// setEpNotes(storedEpNotes)
    //}
//}, [])



/**Editing Character Notes**/
const [isEditingCharNotes, setIsEditingCharNotes] = useState()
const [characterNotes, setCharacterNotes] = useState({})

function editCharNotes(epTitle){
    setIsEditingCharNotes(epTitle)
}

function updateCharNotes(value, epTitle){
    setCharacterNotes((prev) => ({
        ...prev,
        [epTitle]:value
    }))
}

/**********************
 ACCOUNT CONTEXT OBJECT
***********************/
const profileCtx = {
   /***saveShows****/
    myShows,
    setMyShows,
    saveShow,
    displayShows,
    
    /***currWatch****/
    currentlyBinging, 
    binging,  
    bingingChecked,

    /***bio***/
    bio,
    editingBio,
    editBio,
    saveBio,
    updateBio,
    bioAvatar,
    uploadAvatar,

    /*Episode Notes*/
    areNotesOpen,
    openNotes,

    isEditingEpNotes, 
    editEpNotes,
    updateEpNotes,
    saveNotes,
    epNotes,

    isEditingCharNotes,
    editCharNotes,
    updateCharNotes,
    characterNotes,

    
}

return (
    <UserProfileContext.Provider value ={profileCtx}>
        {children}
    </UserProfileContext.Provider>
    );
}