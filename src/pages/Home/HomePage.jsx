//IMPORTS - Hooks
import { NavLink } from "react-router-dom"
//IMPORTS - Components 
import TextContent from "../../components/UI/TextContent"
import { Auth } from "../../components/auth"
//IMPORTS - Styles
import styles from "./HomePage.module.css"

function HomePage() {
  return (
    <main className={styles.mainWrapper}>
        <h1>What's BingeLog?</h1>
        <p>
            Netflix. Max. Hulu. Disney+. Crunchyroll. The age of streaming is a mishmash of different sources of entertainment with monthly new releases. Do you have the time to watch everything? Can you even keep track of it all? Welcome to BingeLog. Toss all your the shows and movies you still need to watch or catch up on into a list. Keep track of each and every episode and share with friends live updates so they don’t spoil what happens two episodes from now in that big final episode of the season. Be as detailed as you want. Track entire characters and their arcs. Settings. Plot points. Make notes for each episode.
        </p>
<NavLink to="/about"><h2>Click here to learn more</h2></NavLink>
    <Auth/>
    </main>
    
  )
}
export default HomePage
