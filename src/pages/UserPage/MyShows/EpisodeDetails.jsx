// IMPORTS - Hooks

// IMPORTS - Components
import ShowNotes from "./ShowNotes"
import Input from "../../../components/UI/Input"

// IMPORTS - Styles
import styles from "./EpisodeDetails.module.css"

function EpisodeDetailsCopy({ seasonTitle, show }) {
    
  const selectedSeason = show.seasons.find(
    (season) => season.title === seasonTitle
  )
  
  return (
    <main className={styles.epWrapper}>
      <div>
        <p className = {styles.epList}>Episodes List</p>
      </div>
      {selectedSeason && (
        <div key={selectedSeason.title}>
          {selectedSeason.episodes?.map((ep) => (
            <div className = {styles.singleEp} key={ep.title} id={ep.title}>
              <header>
                <h3>{ep.title}</h3>
                  <div className={styles.noteBttnsDiv}>
                    <ShowNotes show = {show} epTitle={ep.title} showTitle={show.title}/> 
                  </div>
              </header>
              <br/>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default EpisodeDetailsCopy