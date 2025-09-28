//IMPORTS - Hooks
import { useState, useContext, useEffect } from "react"
//IMPORTS - Components 
import Bttn from "../../../components/UI/Bttn";
import ShowDetails from "./ShowDetails"
import { UserProfileContext } from "../../../components/Contexts/UserProfileContext";
import { UserAccountContext } from "../../../components/Contexts/UserAccountContext";

//IMPORTS - Styles
import styles from "./MyShows.module.css"


function MyShows({id}) {
 const [showId, setShowId] = useState("")
 const userCtx = useContext(UserProfileContext)
 const userAcctCtx = useContext(UserAccountContext)
 
 
function handleOnClick(id){
  setShowId(id)
}


return (
      <main {...id}className ={styles.showWrapper}>
        <h2>Show Sorting Options </h2>
        {userCtx.myShows.map((show) => (
          <div className ={styles.showTitle} key={show.imdbId}>
            <p onClick={() => handleOnClick(show.imdbId)}>{show.title}</p>
            <div className ={styles.showStatus}>
              <label> Finished
                <input type="checkbox" />
              </label> || 
              <label> Currently Binging
                <input 
                  type="checkbox"
                  onClick={() => userCtx.binging(show.title)}
                />
              </label>
            </div>
            {showId === show.imdbId && 
              <ShowDetails id={showId} show={show} />}
          </div>
        ))}
      </main>
  )
}
export default MyShows


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
        // Corrected typo: `formData.passowrd` to `formData.password`
        if (user && user.password === userData.password) {
            localStorage.setItem("user", JSON.stringify(user));
            setUserAccount(user);
            setIsLoggedIn(true);
            
            stopLoggingIn();
            return true;
        } else {
            console.log("Login failed: Invalid username or password.");
            return false;
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



