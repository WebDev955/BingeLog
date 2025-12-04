import { createSlice } from "@reduxjs/toolkit";

//initial state of Auth, deals with user, account creation, loggin 
const initialState = {
    //when a user logs in, user is provided with the key:value pairs, such as username:username, pass: password, etx
    user: null, 
    isCreatingAccount: false,
    isLoggedIn: false,
    isLoggingIn: false,
}

console.log(initialState.user)
//create a const variable to contain entire slice
    // createSlice is an object 
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        startCreatingAccount(state) {
            state.isCreatingAccount = true;
            
        },
        stopCreatingAccount(state) {
            state.isCreatingAccount = false
        },
        startLoggingIn(state) {
            state.isLoggingIn = true;
        },
        stopLoggingIn(state) {
            state.isLoggingIn = false;
        },
        login(state, action){
            const {uid, email, userName} = action.payload // save everything from Firebase
            state.user = {uid, email, userName}
            state.isLoggedIn = true
            state.isLoggingIn = false
        },
        logOut(state) {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer