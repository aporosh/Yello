import { createSlice } from "@reduxjs/toolkit";
import { getChallIdFromUrl } from "../../utils/common";

const challengeSlice = createSlice({
    name: "challenge",
    initialState: {
        challengeId: '',
        pageType: `${window.location.pathname.split('/')[1]}`,
    },
    reducers: {
        togglePageType: (state, { payload }) => {
            state.pageType = payload;
        }, 
        getIdFromUrl: (state) => {
            state.challengeId = getChallIdFromUrl(window.location.href);
        },
    }
});
export const { togglePageType, getIdFromUrl } = challengeSlice.actions;

export default challengeSlice.reducer;