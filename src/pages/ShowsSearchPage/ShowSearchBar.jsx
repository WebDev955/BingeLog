
//IMPORTS - Hooks
import { useEffect, useState } from "react";
//IMPORTS - Components 
import SearchDropdown from "./SearchDropdown";
//IMPORTS - Styles
import styles from './ShowSearchBar.module.css'

function ShowSearchBar() {
    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState(null)

    useEffect(() => {
        if (!query) return; // skip if input is empty
        const timeoutId = setTimeout(() => {
            async function fetchShow(query) {
                try {
                    const url = `https://streaming-availability.p.rapidapi.com/shows/search/title?title=${query}&country=us&series_granularity=episode&output_language=en`;

                    const options = {
                        method: 'GET',
                        headers: {
                            'x-rapidapi-key': 'a89fb87d38msh09f056f5c014528p1a7f90jsn35606eacd94f',
                            'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
                        }
                    };

                    const res = await fetch(url, options);
                    const data = await res.json();
                    setSearchResults(data);
                    console.log(data);
              
                } catch (error) {
                    console.error(error);
                }
            }

            fetchShow(query);
        }, 500); // wait 500ms after typing stops

        return () => clearTimeout(timeoutId); // cleanup if user types again before 500ms
    }, [query]);

    return (
        <div className={styles.mainWrapper}>
            <input 
                type ="search" 
                placeholder="Seach a show"
                value = {query}
                onChange = {(event) => setQuery(event.target.value)}
                />
            {searchResults && 
                <SearchDropdown searchResults={searchResults} query={query} /> 
            }
        </div>
  )
}
export default ShowSearchBar

