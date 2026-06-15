//IMPORTS - Hooks
//IMPORTS - Components 
//IMPORTS - Styles
  //import styles from FILE LOCATION

import Footer from "../../components/UI/Footer"
import styles from "../Home/HomePage.module.css"
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
function About() {


  return (
    <>
        <h2>About Page</h2>
        <main className={styles.mainWrapper}>
        <h1>What's BingeLog?</h1>
        <p>
            Netflix. Max. Hulu. Disney+. Crunchyroll. The age of streaming is a mishmash of different sources of entertainment with monthly new releases. Do you have the time to watch everything? Can you even keep track of it all? Welcome to BingeLog. Toss all your the shows and movies you still need to watch or catch up on into a list. Keep track of each and every episode and share with friends live updates so they don’t spoil what happens two episodes from now in that big final episode of the season. Be as detailed as you want. Track entire characters and their arcs. Settings. Plot points. Make notes for each episode.
        </p>
  </main> 
        <Footer/>
    </>
  )
}
export default About