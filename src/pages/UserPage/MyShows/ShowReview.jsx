//IMPORTS
import { useState } from "react"
import { db, app, auth, getDoc, doc, updateDoc} from "../../../firebase/firebase"

//IMPORTS - Styles
import styles from "./ShowReview.module.css"

//Import - REDUX
import { useSelector, useDispatch } from "react-redux"
import { showActions } from "../../../store/slices/showsSlice"

function ShowReview({showId, showTitle}){
    //Local draft input of a review
    const [draftReview, setDraftReview] = useState('')
    const [reviewScore, setReviewScore] = useState("")

    const dispatch = useDispatch()

    const myReviews = useSelector((state) => state.shows.reviews)
    console.log("Reviews", myReviews)
    
    const savedReview = myReviews.find((id) => id.showId === showId)
    console.log("Review Id", savedReview)

    const userId = useSelector(state => state.auth.user.uid);
    const docRef = doc(db, "Users", userId);

    function updateReview(value){
        setDraftReview(value)
    }

    const updateReviewScore = (value) => {
        setReviewScore(value)
    }

    async function handleSaveReview(){
        const safeText = draftReview?.trim() ?? ""
      
        const newReview = {
            showId: showId,
            title: showTitle,
            text: safeText,
            score: reviewScore,
            createdAt: Date.now()
        };

        // Ensure array (in case Firestore returns undefined)
        const existingReviews = Array.isArray(myReviews) ? myReviews : [];

        const updatedReviews = [
            ...existingReviews.filter(r => r.showId !== showId),
            newReview
        ];

        await updateDoc(docRef, {
            reviews: updatedReviews
        });
        dispatch(showActions.updateReviews(updatedReviews))
        alert ("Review Saved!")
    }    
        return(
            <div className = {styles.reviewDivWrapper}>
                <div>
                    <p>{savedReview.text}</p>
                    <p>{reviewScore}</p>
                </div>
                <textarea 
                    value={draftReview || savedReview.text}
                    onChange = {(e) => updateReview(e.target.value)}
                />
                <label> Review Score
                    <select onChange={(e) => updateReviewScore(e.target.value)}>
                        <option value = "1"> 1/5 Stars </option>
                        <option value = "2"> 2/5 Stars </option>
                        <option value = "3"> 3/5 Stars </option>
                        <option value = "4"> 4/5 Stars </option> 
                        <option value = "5"> 5/5 Stars </option>
                    </select>
                </label>
                <button onClick={() => handleSaveReview()}>Save Review</button>
            </div>
        )
}

export default ShowReview