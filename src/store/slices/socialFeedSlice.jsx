import { createSlice } from "@reduxjs/toolkit";

//initial state of autoStatuses
const initialState = {
    autoStatuses: [],
    manualStatuses: []
}

const socialFeedSlice = createSlice({
    name: "socialfeed",
    initialState,
    reducers: {
        updateAutoStatuses(state, action){
            state.autoStatuses = action.payload
        },
        
        addAutoStatus (state, action){
            state.autoStatuses.push(action.payload)
        },

        updateManualStatuses(state, action){
            state.manualStatuses = action.payload
        }
    }
})

export const socialFeedActions = socialFeedSlice.actions
export default socialFeedSlice.reducer 