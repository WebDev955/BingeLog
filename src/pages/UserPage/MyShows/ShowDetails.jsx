//IMPORTS - Hooks
import {useState } from "react"
import {motion, AnimatePresence} from 'framer-motion'
//IMPORTS - Components
import EpisodeDetails from "./EpisodeDetails"
//IMPORTS - Styles
import styles from "./ShowDetails.module.css"


function ShowDetails({show}) {

  const [seasonTitle, setSeasonTitle] = useState("")

  function selectSeason(season){
    setSeasonTitle(season)

    if (seasonTitle === season) {
      setSeasonTitle("")
    }
}
  return (
    <motion.main className={styles.seasonsWrapper}>
        <p className={styles.seasonsTitle}>Seasons List</p>
        {show && (
            <div key={show.id}>
              {show.seasons?.map((season) => (
                <p key = {season.title} onClick={() => selectSeason(season.title)}>
                  {season.title}
                </p>
            )
            )} 
            <AnimatePresence>
              {seasonTitle &&
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto"}}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  key={show.id} 
                >
                  <EpisodeDetails seasonTitle={seasonTitle} show={show}/>
                </motion.div>
              }
              </AnimatePresence>
          </div>
        )}
    </motion.main>
  )
}

export default ShowDetails
