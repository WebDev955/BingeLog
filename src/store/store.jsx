//import configure store - allows for use of redux store and reducers
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import showsReducer from "./slices/showsSlice";
import notesReducer from "./slices/notesSlice"
import friendsReducer from "./slices/friendsSlice"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        shows: showsReducer,
        notes: notesReducer,
        friends: friendsReducer
    }
});