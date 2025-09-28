//IMPORTS - Hooks
import { Outlet } from "react-router-dom"
//IMPORTS - Components 
import MainNav from "./MainNav"
import Footer from "./Footer"
//IMPORTS - Styles

function RootLayout() {
  return (
    <>
       
        <main>
            <Outlet/>
        </main>
        <MainNav/>
        
    </>
  )
}
export default RootLayout
