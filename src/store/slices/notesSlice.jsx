import { createSlice} from "@reduxjs/toolkit";

//default state of notes
const initialState = {
    epNotes: [],
    charNotes: []
}

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        updateEpNotes(state, action){
            state.epNotes = action.payload //new episode notes
        },
        updateCharNotes(state, action){
            state.charNotes = action.payload //new character notes
        }
    }
});

export const notesActions = notesSlice.actions;
export default notesSlice.reducer

