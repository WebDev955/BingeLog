//IMPORTS - Hooks
import { Outlet } from "react-router-dom";
//IMPORTS - Components
import MainNav from "./MainNav";
import ToastNotification from "./ToastNotification";

//IMPORTS - Styles
import { useSelector } from "react-redux";
import styles from "./RootLayout.module.css";

function RootLayout() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <main className={isLoggedIn ? styles.mainContent : undefined}>
        <ToastNotification/>
        <Outlet />
      </main>
      {isLoggedIn ? <MainNav /> : null}
    </>
  );
}
export default RootLayout;
