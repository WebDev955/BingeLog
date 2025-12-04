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
    
    const dispatch = useDispatch()
    const myReviews = useSelector((state) => state.shows.reviews)
    const userId = useSelector(state => state.auth.user.uid);
    
    const docRef = doc(db, "Users", userId);

    function updateReview(value){
        setDraftReview(value)
    }

    async function handleSaveReview(){
        const safeText = draftReview?.trim() ?? ""
      
        const newReview = {
            showId: showId,
            title: showTitle,
            text: safeText,
            createdAt: Date.now()
        };

        // Ensure array (in case Firestore returns undefined)
        const existingReviews = Array.isArray(myReviews) ? myReviews : [];

        const updatedReviews = [
            ...existingReviews.filter (r => r.showID !== showId),
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
                <textarea 
                    value={draftReview}
                    onChange = {(e) => updateReview(e.target.value)}
                />
            <button onClick={() => handleSaveReview()}>Save Review</button>
            </div>
        )
}

export default ShowReview