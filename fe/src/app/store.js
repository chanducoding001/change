import { configureStore } from "@reduxjs/toolkit";
import apiSlicer from "./apiSlicer";

const store = configureStore({
    reducer:{
        apiSlicer
    },
});

export default store;