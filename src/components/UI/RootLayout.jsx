//IMPORTS - Hooks
import { Outlet } from "react-router-dom"
//IMPORTS - Components 
import MainNav from "./MainNav"
import Footer from "./Footer"
//IMPORTS - Styles
import { useSelector } from "react-redux"

function RootLayout() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  return (
    <>
        <main>
            <Outlet/>
        </main>
        {isLoggedIn
          ? <MainNav/>
          : null
        }
    </>
  )
}
export default RootLayout
