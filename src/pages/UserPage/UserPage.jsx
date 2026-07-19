//IMPORTS - Hooks
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

//IMPORTS - Components
import Bttn from "../../components/UI/Bttn";
import Bio from "../UserPage/Bio/Bio";

//IMPORTS - Styles
// import styles from "./UserPage.module.css";
import styles from "./UserPageUPDATE.module.css";
//import MyShows from "./MyShows/MyShows"
import MyShows from "./MyShows/MyShows";
import MyReviews from "./MyReviews/MyReviews";
import CurrentlyWatching from "./CurrentlyWatching/CurrentlyWatching";
import MyPosts from "./MyPosts/MyPosts";

function UserPage() {
  const [renderContent, setRenderContent] = useState("displayShows");
  const [animateKey, setAnimateKey] = useState("displayShows");

  const params = useParams();
  const id = params.id;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  //display Components
  //function displayShows(){
  //setContent(<MyShows userId={id}/>)
  //}
  //function displayReviews(){
  //setContent(<MyReviews userId={id}/>)
  //}
  //function displayWatching(){
  //setContent(<CurrentlyWatching userId={id}/>)
  //}

  function displayContent(value) {
    setRenderContent(value);
    setAnimateKey(value);
  }

  return (
    <>
      <main className={styles.mainWrapper} id={id}>
        <Bio id={id} />
        <div className={styles.menuBttnsWrapper}>
          <Bttn
            className={
              renderContent === "displayShows"
                ? styles.activeBttn
                : styles.menuBttns
            }
            onClick={() => displayContent("displayShows")}
          >
            Shows
          </Bttn>
          <Bttn
            className={
              renderContent === "displayReviews"
                ? styles.activeBttn
                : styles.menuBttns
            }
            onClick={() => displayContent("displayReviews")}
          >
            Reviews
          </Bttn>
          <Bttn
            className={
              renderContent === "displayWatching"
                ? styles.activeBttn
                : styles.menuBttns
            }
            onClick={() => displayContent("displayWatching")}
          >
            Binging
          </Bttn>
          <Bttn
            className={
              renderContent === "displayPosts"
                ? styles.activeBttn
                : styles.menuBttns
            }
            onClick={() => displayContent("displayPosts")}
          >
            Posts
          </Bttn>
          <Bttn className={styles.menuBttns} onClick={() => displayContent("")}>
            Likes
          </Bttn>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={animateKey}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={styles.mainContent}
          >
            {renderContent === "displayShows" && <MyShows />}
            {renderContent === "displayReviews" && <MyReviews />}
            {renderContent === "displayWatching" && <CurrentlyWatching />}
            {renderContent === "displayPosts" && <MyPosts />}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
export default UserPage;
