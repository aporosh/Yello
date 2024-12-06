import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getChallIdFromUrl, getPage } from "../../utils/common";
import { BASE_URL } from "../../utils/config";
import axios from "axios";

export const createChallenge = createAsyncThunk(
    'challenge', 
    async (payload, thunkAPI) => {
    try {
        const res = await axios.post(`${BASE_URL}`, payload);
        return res.data;
    } catch(err) {
        console.log(err);
        return thunkAPI.rejectWithValue(err)
    }
})

export const addChallenger = createAsyncThunk(
    'challenge/addChallenger', 
    async (payload, thunkAPI) => {
    try {
        const res = await axios.post(`${BASE_URL}/${payload.id}/challengers`, payload);
        return res.data;
    } catch(err) {
        console.log(err);
        return thunkAPI.rejectWithValue(err)
    }
})
export const updateChallenger = createAsyncThunk(
    'challenge/updateChallenger',
    async (payload, thunkAPI) => {
        try {
            const res = await axios.patch(`${BASE_URL}/${payload.id}/challengers`, payload);
        return res.data;
    } catch(err) {
        console.log(err);
        return thunkAPI.rejectWithValue(err)
        }
    }
)


const addCurrentChallenge = (state, { payload }) => {
        state.currentChallenge = payload;
    };


const challengeSlice = createSlice({
    name: "challenge",
    initialState: {
        currentChallenge: null,
        isLoading: false,
        showChallengeForm: false,
        showChallengersForm: false,
        challengeId: '',
        activeChallenger: '',
        challengerData: {},
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
        toggleChallengeForm: (state, { payload }) => {
            state.showChallengeForm = payload;
        },
        toggleChallengersForm: (state, { payload }) => {
            state.showChallengersForm = payload;
        },
        toggleChallengerId: (state, { payload }) => {
            state.activeChallenger = payload;
        },
        setChallengerData: (state, { payload }) => {
            state.challengerData = payload;
        },
        setChallengeId: (state, { payload }) => {
            state.challengeId = payload;
        },
    },

    extraReducers: (buider) => {
        buider.addCase(createChallenge.fulfilled, addCurrentChallenge);
        buider.addCase(addChallenger.fulfilled, addCurrentChallenge);
        buider.addCase(updateChallenger.fulfilled, addCurrentChallenge);
    },
});
export const { 
    togglePageType, 
    getIdFromUrl, 
    toggleResultsType, 
    toggleChallengeForm, 
    toggleChallengersForm, 
    toggleChallengerId, 
    setChallengerData,
    setChallengeId
 } = challengeSlice.actions;

export default challengeSlice.reducer;
//`${window.location.pathname.split('/')[1]}`