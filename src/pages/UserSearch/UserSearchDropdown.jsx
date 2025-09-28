//IMPORTS - Hooks
import { NavLink } from "react-router-dom"
import { useState } from "react"
//IMPORTS - Components 
import UsersList from "./UserList"

//IMPORTS - Styles
import styles from "./SearchDropdown.module.css"


function UserSearchDropdown({searchResults, query}) {

  const [selectedUser, setSelectedUser] = useState(null)

  function displayUserDetails(user) {
        setSelectedUser(user);
    }
    console.log(searchResults)

  return (
    <>
    <div className={styles.mainDropdownWrapper}>
      <div>
        {searchResults.map((user) => (
              <p key={user.id} onClick={() => displayUserDetails(user)}>{user.userName}</p>
        ))}
      </div>    
    </div>
    <div>
        {selectedUser && (
            <UsersList userDetails ={selectedUser} />
            )}
    </div>
    </>
  )
}
export default UserSearchDropdown

