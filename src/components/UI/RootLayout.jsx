//IMPORTS - Hooks
import { Outlet } from "react-router-dom";
//IMPORTS - Components
import MainNav from "./MainNav";
import ToastNotification from "./ToastNotification";

//IMPORTS - Styles
import { useSelector } from "react-redux";

function RootLayout() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <main>
        <ToastNotification/>
        <Outlet />
      </main>
      {isLoggedIn ? <MainNav /> : null}
    </>
  );
}
export default RootLayout;
