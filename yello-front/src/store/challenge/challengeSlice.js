import { createSlice } from "@reduxjs/toolkit";
import { getChallIdFromUrl, getPage } from "../../utils/common";

const challengeSlice = createSlice({
    name: "challenge",
    initialState: {
        challengeId: '',
        pageType: getPage(),
        resType: false, //show only active results, true - show all results
    },
    reducers: {
        togglePageType: (state, { payload }) => {
            state.pageType = payload;
        }, 
        getIdFromUrl: (state) => {
            state.challengeId = getChallIdFromUrl(window.location.href);
        },
        toggleResultsType: (state, { payload }) => {
            state.resType = !state.resType;
        }, 
    }
});
export const { togglePageType, getIdFromUrl, toggleResultsType } = challengeSlice.actions;

export default challengeSlice.reducer;
//`${window.location.pathname.split('/')[1]}`