//IMPORTS - Hooks
import { NavLink, Navigate } from "react-router-dom";
//IMPORTS - Components
import LandingPage from "./LandingPage";

import { useSelector } from "react-redux";

const HomePage = () => {
  const userLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const uid = useSelector((state) => state.auth.user?.uid);

  if (userLoggedIn) return <Navigate to={`userPage/${uid}`} />;
  return <LandingPage />;
};
export default HomePage;
