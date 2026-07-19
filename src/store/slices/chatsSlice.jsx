import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatThreads: [],
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    // Called with full array on hydration — replaces entire state
    updateChatThreads(state, action) {
      state.chatThreads = action.payload;
    },
    // Called with a single new thread on creation
    addChatThread(state, action) {
      state.chatThreads.push({ ...action.payload, comments: [] });
    },

    updateComments(state, action) {
      const thread = state.chatThreads.find(
        (thread) => thread.threadId === action.payload.threadId,
      );
      
      if (thread) {
        // action.payload.comments is an array, spread it in
        thread.comments.push(
          ...action.payload.comments.map((c) => ({
            ...c,
            replies: [],
          })),
        );
      }
    },
    updateReplies(state, action) {
      const thread = state.chatThreads.find(
        (thread) => thread.threadId === action.payload.threadId,
      );
      if (thread) {
        const comment = thread.comments.find(
          (comment) => comment.commentId === action.payload.commentId,
        );
        if (comment) {
          comment.replies.push(action.payload.reply);
        }
      }
    },
  },
});

export const chatsActions = chatsSlice.actions;
export default chatsSlice.reducer;
