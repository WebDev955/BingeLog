//IMPORTS - Hooks
//IMPORTS - Components 
import ShowsList from "./ShowsList"
import ShowSearchBar from "./ShowSearchBar"

//IMPORTS - Styles
import styles from "./ShowsPage.Module.css"

function ShowsPage() {
  return (
    <>
      <main className={styles.mainWrapper}> 
        <header>
            <h1>Shows List Page</h1>
            <ShowSearchBar/>
        </header>
     
      </main>
    </>
  )
}
export default ShowsPage
