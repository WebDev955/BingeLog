//IMPORTS - Hooks
//IMPORTS - Components 
import UserSearchBar from "./userSearchBar"

//IMPORTS - Styles
import styles from "./ShowsPage.Module.css"

function UserSearchPage() {  
  return (
    <>
      <main className={styles.mainWrapper}> 
        <header>
            <h1>User Search</h1>
            <UserSearchBar/>
        </header>
     
      </main>
    </>
  )
}
export default UserSearchPage
