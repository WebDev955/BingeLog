
//IMPORTS - Hooks
import { useEffect, useState } from "react";
//IMPORTS - Components 
import UserSearchDropdown from "./userSearchDropdown";
//IMPORTS - Styles
import styles from './ShowSearchBar.module.css'
import {doc, getDoc, db, collection, getDocs } from "../../firebase/firebase"

function UserSearchBar() {
    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState(null)

    useEffect(() => {
        async function fetchUser(query){ 
            if (!query) return;
        
            try {
                const querySnapShot = await getDocs(collection (db, "Users"))
                const globalUsersList = querySnapShot.docs.map(doc =>({
                    id: doc.id,      //expose user
                    ...doc.data(),  //spread field data
                }))

                const globalUsersFiltered = globalUsersList.filter(user =>
                   user.userName?.toLowerCase().includes(query.toLowerCase())
                )

            setSearchResults(globalUsersFiltered)
            console.log("Query Data", globalUsersFiltered)

            } catch (err) {
            console.error ("Can't find global users", err)
        }    
    }
    fetchUser(query)
}, [query])
    
    return (
        <div className={styles.mainWrapper}>
            <input 
                type ="search" 
                placeholder="Seach a user"
                value = {query}
                onChange = {(event) => setQuery(event.target.value)}
                />
            {searchResults && 
                <UserSearchDropdown searchResults={searchResults} /> 
            }
        </div>
  )
}
export default UserSearchBar

