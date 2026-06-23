//IMPORTS - Hooks
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
//IMPORTS - Components
import ShowsList from "./ShowsList";
//IMPORTS - Styles
import styles from "./SearchDropdown.module.css";

function SearchDropdown({ searchResults, query }) {
  const [selectedShow, setSelectedShow] = useState("");
  const myShows = useSelector((state) => state.shows.myShows);

  function displayShowDetails(show) {
    setSelectedShow(show);
    if (selectedShow) {
      setSelectedShow("");
    }
  }
  return (
    <div className={styles.mainDropdownWrapper}>
      <div>
        {searchResults
          .filter((show) =>
            show.title.toLowerCase().includes(query.toLowerCase()),
          )
          .map((show) => {
            const alreadySaved = myShows.some(
              (savedShow) => savedShow.id === show.imdbId,
            );
            return (
              <div
                className={styles.showResult}
                onClick={() => displayShowDetails(show)}
              >
                <div className={styles.showTitle}>
                  <div className={styles.showTitles}>
                    <p key={show.imdbId}>{show.title}</p>
                    {alreadySaved && (
                      <p className={styles.savedShow}>Already Added</p>
                    )}
                  </div>
                  <img src={show.imageSet.horizontalPoster.w360} />
                </div>
                {selectedShow.imdbId === show.imdbId && (
                  <ShowsList showDetails={selectedShow} />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default SearchDropdown;
