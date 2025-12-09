import { createSlice } from "@reduxjs/toolkit";

//initial state of shows
const initialState= {
    myShows: [],
    currentlyBinging: [],
    watchedEps:[],
    finishedShows: [],
    isReviewing: false,
    reviews: [],
    reviewingShowId: null,
}

const showsSlice = createSlice({
    name: "shows",
    initialState,
    reducers: {
        updateMyShows(state, action){
            //update entire myShows array (add new show, update show status)
            state.myShows = action.payload 
        },
        updateBinging(state, action){
            state.currentlyBinging = action.payload //adding title to binging list
       
        },
        updateWatchedEps(state, action){
            state.watchedEps = action.payload //adding ep title, show title
          
        },
        updateFinishedShows(state, action){
            state.finishedShows = action.payload //adding title, id of finished show
      
        },
        reviewingShow (state, action){
            state.reviewingShowId = action.payload //grabs id show 
        },
        toggleReviewing(state){
            state.isReviewing = !state.isReviewing
        },
        updateReviews(state, action){
           state.reviews = action.payload //newly added reivew object
        }

    }
});

export const showActions = showsSlice.actions;
export default showsSlice.reducer