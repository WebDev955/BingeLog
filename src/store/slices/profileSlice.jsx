import { createSlice } from "@reduxjs/toolkit";


//initial state of profile
const initialState = {
    bio: "Set bio here!",
    isEditingBio: false,
    profileImgUrl: ""
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        editBio(state) {
            state.isEditingBio = true
        },
        saveBio(state){
            state.isEditingBio = false
        }, 
        updateBio(state, action) {
            state.bio = action.payload //what the user typed into bio txt box
        },
        uploadAvatar(state, action) {
            state.profileImgUrl = action.payload //user chosen image
        },
    },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer
