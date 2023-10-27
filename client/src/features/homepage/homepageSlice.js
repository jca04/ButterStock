import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: 'dataUser',
  initialState: [],
  reducers: {
    addHome: (state, action) => {
      state[0] = action.payload;
    },
    deleteHome: (state, action) => {
      state = [];
    }
  }
})
export const {addHome, deleteHome} = homeSlice.actions;
export default homeSlice.reducer;