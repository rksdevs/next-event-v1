import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [] // Initial state, without accessing localStorage
};

const eventSlice = createSlice({
  name: "eventsState",
  initialState,
  reducers: {
    addNewEvent: (state, action) => {
      state.events.push(action.payload);
    }
  }
});

export const { addNewEvent } = eventSlice.actions;
export default eventSlice.reducer;