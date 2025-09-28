
//IMPORTS - Hooks
import { useEffect, useState } from "react";
//IMPORTS - Components 
import UserSearchDropdown from "./userSearchDropdown";
//IMPORTS - Styles
import styles from './ShowSearchBar.module.css'

function UserSearchBar() {
    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState(null)

    useEffect(() => {
        async function fetchUser(query){
             if (!query) return;
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
    
    return (
        <div className={styles.mainWrapper}>
            <input 
                type ="search" 
                placeholder="Seach a user"
                value = {query}
                onChange = {(event) => setQuery(event.target.value)}
                />
            {searchResults && 
                <UserSearchDropdown searchResults={searchResults} query={query} /> 
            }
        </div>
  )
}
export default UserSearchBar

