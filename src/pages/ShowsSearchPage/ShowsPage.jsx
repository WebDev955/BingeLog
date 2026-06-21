//IMPORTS - Hooks
//IMPORTS - Components 
import ShowsList from "./ShowsList"
import ShowSearchBar from "./ShowSearchBar"

//IMPORTS - Styles
import styles from "./ShowsPage.Module.css"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";




function ShowsPage() {
  
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
      <main className={styles.mainWrapper}> 
        <header>
            <h1>Shows List Page</h1>
            <ShowSearchBar/>
        </header>
      </main>
  )
}
export default ShowsPage
