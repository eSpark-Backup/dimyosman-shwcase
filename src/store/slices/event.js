import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  objectForNewEvent: null,
  isEvent: false,
  calendarDate: null,
  calendarEvents: [],
};

const slice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    editEvent: (state, action) => {
      const { id, updatedEvent } = action.payload;
      const index = state.events.findIndex((event) => event.id === id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...updatedEvent };
      }
    },
    updateEvents(state, action) {
      state.events = action.payload;
    },
    setObjectForNewEvent: (state, action) => {
      state.objectForNewEvent = action.payload;
    },
    setIsEvent:(state,action) => {
      state.isEvent = action.payload;
    },
    setIsCalendarEvents: (state, action) => {
      state.calendarEvents = action.payload;
    },
    setIsCalendarEventDate: (state, action) => {
      state.calendarDate = action.payload;
    },
    setCalendarStatesEmpty: (state) => {
      state.calendarEvents = [];
      state.calendarDate = null;
    },
  },
});

export const {
  addEvent,
  editEvent,
  updateEvents,
  setObjectForNewEvent,
  setIsEvent,
  setIsCalendarEvents,
  setIsCalendarEventDate,
  setCalendarStatesEmpty
} = slice.actions;

export default slice.reducer;
