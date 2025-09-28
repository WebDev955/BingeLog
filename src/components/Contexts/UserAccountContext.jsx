import {createContext, useEffect, useState, useContext} from "react";
import { UserProfileContext } from "./UserProfileContext";



//Create Context - JUST A TEMPLATE / DEFAULT VALUES
//NOTE STATES OR HOOKS
// eslint-disable-next-line react-refresh/only-export-components
export const UserAccountContext = createContext({

/****ACCOUNT CREATION*****/

/* 1. userData (takes form of an objecgt) */
userAccount: {
    id: undefined,  
    email: undefined,
    userName: undefined,
    password: undefined,
    myShows: [],
    friendList: []
},

/* Bingfeed List */
bingeFeed: [{
    userName: undefined,
    currBinge: [],
    recentlyWatchedEp: {   
        epName: undefined,
        showName: undefined   
    },
    recentlyFinishedShow: undefined  
}],

addFriend: () => {},
   

/* 2. Creating Account */
isCreatingAccount: false,
createNewUser: async () => {},
startCreatingAccount: () => {},
stopCreatingAccount: () => {},

/* 3. Logged In Status */
isLoggingIn: false,
isLoggedIn: false,
startLoggingIn: () => {},
stopLoggingIn: () => {},
verifyLogin: () => {},
logOut: () => {}
});


/*******************************CONTEXT PROVIDER********************************************/
//Only in Provider is where you create/use functions and estbalish/change state

export function UserAccountContextProvider({children}){

const userProf = useContext(UserProfileContext)
    
/****User Account Info*****/
    const [userAccount, setUserAccount] = useState({
        id: undefined,
        email: undefined,
        userName: undefined,
        password: undefined,
        myShows: [],
        friendList: [],
    })

    console.log(userAccount)

/**********************
 ACCOUNT CREATION
***********************/
//State - open/closes Create Account Modal
const [isCreatingAccount, setIsCreatingAccount] = useState(false)

//Functions- open/close create modal 
function startCreatingAccount(){
    setIsCreatingAccount(true)
}
function stopCreatingAccount(){
    setIsCreatingAccount(false)
}

//Function - create and store user account info, login user 
async function createNewUser(newUserData){
     const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            'Content-Type':"application/json"
        },
        body: JSON.stringify (newUserData)
    }) 
    const createdUser = await response.json();
    localStorage.setItem("user", JSON.stringify(createdUser))
    setUserAccount(createdUser)
    setIsLoggedIn(true)
    stopCreatingAccount()
}

/**********************
 LOGIN/LOGOUT 
***********************/
//State - open/closes Create Account Modal
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [isLoggingIn, setIsLoggingIn] = useState(false)

function startLoggingIn(){
    setIsLoggingIn(true)
}

function stopLoggingIn(){
    setIsLoggingIn(false)
}
 function logOut(){
    setIsLoggedIn(false)
    setUserAccount({ 
        id: undefined,
        userName: undefined, 
        password: undefined, 
        email: undefined, 
        myShows: [undefined],
        friendList: [undefined]
    });
    localStorage.removeItem("user");
}

//Verify userData
    //Verify userData
    async function verifyLogin(userData) {
        // Corrected URL: use backticks (``) for template literals
        const url = `http://localhost:3000/users?userName=${userData.userName}`;
        const response = await fetch(url);
        const users = await response.json();
        // Check if the user was found in the database (the array is not empty)
        const user = users[0];
   
        // Check if the user exists and the password matches
        if (user && user.password === userData.password) {
            localStorage.setItem("user", JSON.stringify(user))
            setUserAccount(user);
            setIsLoggedIn(true);
            stopLoggingIn();
            return user//
        } else {
            console.log("Login failed: Invalid username or password.");
            return null
        }
    }

    // Check if a user is already logged in from local storage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserAccount(storedUser);
            setIsLoggedIn(true);
        }
    }, []);

/**********************
 ADDING FRIEND / UPDATING LIST
***********************/

//async function addFriend(id){
    //const userId = userAccount.id
    //console.log("The userId is:", userId)
    //const response = await fetch(`http://localhost:3000/users/${userId}`, {
        //method: "GET"
    //})

//}

/***Display Friends List***/
useEffect(() => {
    fetch("http://localhost:3000/users") 
        .then(res => res.json())
        .then(data => {
            userAccount.friendList(data);
        })
        .catch(error => {
            console.error('Error fetching friends list:', error);
        });
},[])

const [bingeFeed, setBingeFeed] = useState([])

/***Binge Feed Data***/
useEffect(() => {
    fetch("http://localhost:3000/bingeFeed")
    .then(res => res.json())
    .then(data => {
        setBingeFeed(data)
    })
},[])



/**********************
 ACCOUNT CONTEXT OBJECT
***********************/
const accountCtx = {
        userAccount,  
        isCreatingAccount,
        startCreatingAccount,
        stopCreatingAccount,
        createNewUser,


        //addFriend,
        bingeFeed,

        isLoggedIn,
        isLoggingIn,
        startLoggingIn,
        stopLoggingIn,
        verifyLogin,
        logOut,
       
}

return (
    <UserAccountContext.Provider value ={accountCtx}>
        {children}
    </UserAccountContext.Provider>
    );
}