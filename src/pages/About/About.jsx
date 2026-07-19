//IMPORTS - Components
import Footer from "../../components/UI/Footer";
//IMPORTS - Styles
import styles from "./About.module.css";

function About() {
  return (
    <>
      <main className={styles.mainWrapper}>
        <h1>About BingeLog</h1>
        <h2>What's BingeLog?</h2>
        <p>
          Netflix. Max. Hulu. Disney+. Crunchyroll. Streaming today is a
          mishmash of platforms with new releases dropping every month — who
          has the time to watch it all, let alone keep track of it?
        </p>
        <p>
          Welcome to BingeLog. Add every show and movie you still need to
          watch (or catch up on) to your list, and keep track of exactly
          which episode you're on. Share live updates with friends so nobody
          accidentally spoils what happens next.
        </p>
        <p>
          Get as detailed as you want: track characters and their arcs,
          settings, plot points, and leave notes for every episode.
        </p>
      </main>
      <Footer />
    </>
  );
}
export default About;
