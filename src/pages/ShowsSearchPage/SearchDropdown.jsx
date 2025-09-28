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
              <p key={show.imdbId} onClick={() => displayShowDetails(show)}>{show.title}</p>
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

