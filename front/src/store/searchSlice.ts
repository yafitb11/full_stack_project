import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    searchWord: "",
    currentPage: 1,
}


const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchWord: (state, action) => {
            state.searchWord = action.payload;
            state.currentPage = 1;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
});


export const searchActions = searchSlice.actions;
export default searchSlice.reducer;