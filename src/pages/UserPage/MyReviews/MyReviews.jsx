//Import - REDUX
import { useSelector, useDispatch } from "react-redux"
import { showActions } from "../../../store/slices/showsSlice"

//Import - Styles
import styles from "./MyReviews.module.css"

function MyReviews() {
  
  const dispatch = useDispatch()
  const myReviews = useSelector((state) => state.shows.reviews)
  
  return (
    <>
      <main className = {styles.reviewsWrapperDiv}>
        <h1>Reviews</h1>
        {myReviews.map((review) => 
          <div>
            <h1 className = {styles.showTitle}>{review.title}</h1>
            <div className = {styles.showReview}>
              {review.text}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
export default MyReviews
