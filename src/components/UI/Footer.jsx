//IMPORTS - Hooks

//IMPORTS - Components 

//IMPORTS - Styles
import styles from "./Footer.module.css"
import logo from "../../assets/MovieOfTheNightLogo.png"


function Footer() {
  
  return (
    <>
      <footer className={styles.mainWrapper}>
        <h4>Credits</h4>
        <p>
          <a href="https://www.movieofthenight.com/about/api">
            <img 
              width="110px" 
                src= {logo} />
          </a> | Show and Movie Data
        </p>
      </footer>
    </>
  )
}
export default Footer
