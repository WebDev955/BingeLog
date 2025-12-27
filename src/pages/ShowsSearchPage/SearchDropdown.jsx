//IMPORTS - Hooks
import { NavLink } from "react-router-dom"
import { useState } from "react"
//IMPORTS - Components 
import ShowsList from "./ShowsList"
//IMPORTS - Styles
import styles from "./SearchDropdown.module.css"


function SearchDropdown({searchResults, query}) {

  const [selectedShow, setSelectedShow] = useState(null)

  function displayShowDetails(show) {
        setSelectedShow(show);
    }
    console.log(searchResults)
  return (
    <>
    <div className={styles.mainDropdownWrapper}>
      <div>
        {searchResults.filter(show => 
          show.title.toLowerCase().includes(query.toLowerCase())
            ).map((show) => (
              <div className={styles.showDetails} onClick={() => displayShowDetails(show)}>
                  <p key={show.imdbId} >{show.title}</p>
                  <img src = {show.imageSet.horizontalPoster.w360} />
              </div>
        ))}
      </div>    
    </div>
    <div>
        {selectedShow && (
            <ShowsList showDetails ={selectedShow} />
            )}
    </div>
    </>
  )
}
export default SearchDropdown

