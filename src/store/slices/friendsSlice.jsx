import { createSlice } from "@reduxjs/toolkit";

//inital satte of friends
const initialState = {
  friendsList: [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend(state, action) {
      state.friendsList = action.payload; //newly added friend ID
    },
    removeFriend(state, action) {
      state.friendsList = action.payload; //friendsList with friend removed
    },
  },
});

export const friendsActions = friendsSlice.actions;
export default friendsSlice.reducer;
