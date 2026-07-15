//IMPORTS - Hooks
import { NavLink, Navigate } from "react-router-dom";
//IMPORTS - Components
import TextContent from "../../components/UI/TextContent";
import Auth from "../../components/Auth";
import LandingPage from "./LandingPage";

import { useSelector } from "react-redux";

//IMPORTS - Styles
import styles from "./HomePage.module.css";

const HomePage = () => {
  const userLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const uid = useSelector((state) => state.auth.user?.uid);

  if (userLoggedIn) return <Navigate to={`userPage/${uid}`} />;
  return <LandingPage />;
};
export default HomePage;
