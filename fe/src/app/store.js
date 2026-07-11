import { configureStore } from "@reduxjs/toolkit";
import apiSlicer from "./apiSlicer";
import mapSlicer from './mapSlicer';

const store = configureStore({
    reducer:{
        apiSlicer,
        mapSlicer
    },
});

export default store;