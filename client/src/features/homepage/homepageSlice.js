import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: 'dataUser',
  initialState: {},
  reducers: {
    addHome: (state, action) => {
      state = action.payload;
      console.log(state)
    }
  }
})
export const {addHome} = homeSlice.actions;
export default homeSlice.reducer;