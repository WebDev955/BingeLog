//IMPORTS - Hooks
import { useEffect, useState } from "react";
//IMPORTS - Components
import UserSearchDropdown from "./UserSearchDropdown";
//IMPORTS - Styles
import styles from "./UserSearchBar.module.css";
import { doc, getDoc, db, collection, getDocs } from "../../firebase/firebase";

function UserSearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [globalUserList, setGlobalUserList] = useState(null);

  useEffect(() => {
    async function fetchGlobalUsers(){
      try {
        const querySnapShot =  await getDocs(collection(db, "Users"));
        const globalUsers = querySnapShot.docs.map((doc) => ({
          id: doc.id, //expose user
          ...doc.data(), //spread field data
        }));
        setGlobalUserList(globalUsers);

        } catch (err) {
          console.error("Can't find global users", err);
        }
      }
    fetchGlobalUsers()
  },[])

  useEffect(() => {
    if (!globalUserList) return;

    if (!query) {
      setSearchResults(null);
      return;
    }

    const globalUsersFiltered = globalUserList.filter((user) =>
      user.userName?.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(globalUsersFiltered)
  }, [query, globalUserList])

  return (
    <div className={styles.mainWrapper}>
      <input
        type="search"
        placeholder="Search a user"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {searchResults && <UserSearchDropdown searchResults={searchResults} />}
    </div>
  );
}
export default UserSearchBar;
