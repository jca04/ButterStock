import { configureStore } from "@reduxjs/toolkit";
import homeSliceReducer from "../features/homepage/homepageSlice";

export const store = configureStore({
  reducer: { home: homeSliceReducer },
});
