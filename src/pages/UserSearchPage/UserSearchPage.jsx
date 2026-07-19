//IMPORTS - Hooks
//IMPORTS - Components
import UserSearchBar from "./UserSearchBar";

//IMPORTS - Styles
import styles from "./UserSearchPage.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function UserSearchPage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <main className={styles.mainWrapper}>
        <header>
          <h1>User Search</h1>
          <UserSearchBar />
        </header>
      </main>
    </>
  );
}
export default UserSearchPage;
