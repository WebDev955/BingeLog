//IMPORTS - Hooks
import { NavLink } from "react-router-dom";
//IMPORTS - Redux Tool Kit / Slices
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/slices/authSlice";

//IMPORTS - Components
import Bttn from "./Bttn";

//IMPORTS - Styles
import styles from "./MainNav.module.css";
import Login from "../LoginLogOut/Login";

//This tells React to evaluate the JavaScript expression inside the ${} and place the value of id into the path.
//to={`/userPage/${id}`
function MainNav() {
  //DispatchActions and Functions
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const id = useSelector((state) => state.auth.user?.uid);

  function toggleLogIn() {
    dispatch(authActions.startLoggingIn());
  }
  function toggleLogOut() {
    dispatch(authActions.logOut());
  }
  return (
    <header className={styles.mainWrapper}>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.navItem}>
            {isLoggedIn && (
              <NavLink className={styles.navLink} to="/bingelog">
                <img width="35px" src="/BingeLog/BingeLog.png" />
              </NavLink>
            )}
          </li>
          <li className={styles.navItem}>
            {isLoggedIn && id && (
              <NavLink className={styles.navLink} to={`/userPage/${id}`}>
                <img width="35px" src="/BingeLog/UserPage.png" />
              </NavLink>
            )}
          </li>
          <li className={styles.navItem}>
            {isLoggedIn && (
              <NavLink className={styles.navLink} to="/shows">
                <img width="35px" src="/BingeLog/TvIcon.png" />
              </NavLink>
            )}
          </li>
          <li className={styles.navItem}>
            {isLoggedIn && (
              <NavLink className={styles.navLink} to="/userSearch">
                <img width="35px" src="/BingeLog/UserSearchIcon.png" />
              </NavLink>
            )}
          </li>
          <li className={styles.navItem}>
            <NavLink className={styles.navLink} to="/About">
              <img width="35px" src="/BingeLog/HomeIcon.png" />
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <Bttn className={styles.logoutBttn} onClick={toggleLogOut}>
              <img width="35px" src="/BingeLog/LogOut.png" />
            </Bttn>
          </li>
        </ul>
        <Login />
      </nav>
    </header>
  );
}
export default MainNav;
