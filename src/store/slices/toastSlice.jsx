import { createSlice } from "@reduxjs/toolkit";

//initial state of Toast, holds a queue of active toasts to render/dismiss
const initialState = {
  queue: [], // { id, message, type }[]
};

console.log(initialState)

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: {
      reducer(state, action) {
        state.queue.push(action.payload);
      },
      //prepare lets callers pass (message, type) instead of building the payload shape themselves
      prepare(message, type = "success") {
        return { 
          payload: 
          { id: crypto.randomUUID(), 
            message, 
            type 
          }
        };
      },
    },
    dismissToast(state, action) {
      state.queue = state.queue.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const toastActions = toastSlice.actions;
export default toastSlice.reducer;
