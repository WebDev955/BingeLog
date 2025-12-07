async function handleSaveReview(showId, showTitle){
        //creat new reivew object
        const newReview = {
            id: showId,
            title: showTitle,
            text: draftReview,
            createdAt: Date.now()
        }
        const updatedReviews = [...myReviews, newReview]

        try {
            const docRef = doc(db, "Users", userId)
           
            await updateDoc(docRef, {
                reviews: updatedReviews,
            });
            alert ("Review Saved!")
        } catch(err){
            console.log(err)
        }
        dispatch(showActions.updateReviews(updatedReviews))
    }   


//status 
const statuses = [{
    id: 1,
    text: "Currently binging...Recently Watched...Recently Finsihed...",
    likes: null,
    shockedReacts: null,
      chats:[{
        id:1,
        userA: "userAUserName",
        userAText: "You finsished Star Trek! How was it?",
        userBReply: "It was great!"
      }]
}]