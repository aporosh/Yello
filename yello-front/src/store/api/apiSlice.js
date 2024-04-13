import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/config";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL}), 
  tagTypes: ['Challengers', 'Challenge'],
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getChallengeById: builder.query({
      query: ({ id }) => `${id}`,
      providesTags: ["Challenge"],
      transformResponse: (response) => {
        localStorage.setItem('challengeId', response.id)
        localStorage.setItem('chDescription', response.description)
      },
    }),
    getChallengers: builder.query({
      query: ({ id }) => `${id}/challengers`,
      providesTags: ["Challengers"],
    }),
    addNewTrials: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${id}/trials`,
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      transformResponse: (response) => {
        localStorage.setItem('trial', JSON.stringify(response))
        localStorage.setItem('trialId', response.id)
        localStorage.setItem('trialList', JSON.stringify(response.challengers))

      },
      invalidatesTags: ['Challengers'],
    }),
    updateTrials: builder.mutation({
      query: (payload) => ({
        url: `${localStorage.challengeId}/trials/${localStorage.trialId}`,
        method: 'PATCH',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },

      }),

      invalidatesTags: ['Challengers'],
    })
  }),

})

export const { useGetChallengeByIdQuery ,useGetChallengersQuery, useLazyGetChallengersQuery, useAddNewTrialsMutation, useUpdateTrialsMutation } = apiSlice;