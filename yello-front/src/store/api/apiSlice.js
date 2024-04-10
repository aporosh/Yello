import { createApi, fetchBaseQuery,  } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/config";
import { buildUrl } from "../../utils/common";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, referrerPolicy: "no-referrer"}), //referrerPolicy: "strict-origin-when-cross-origin", // no-referrer-when-downgrade, no-referrer, origin, same-origin...
    tagTypes: ['Challengers'],
    endpoints: (builder) => ({
        getChallengers: builder.query({
            query: () => '/challengers',
            providesTags: ["Challengers"],
        }),
        addNewTrials: builder.mutation({
            query: (payload) => ({
              url: '/trials',
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
            url: `/trials/${localStorage.trialId}`,
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

export const { useGetChallengersQuery, useAddNewTrialsMutation, useUpdateTrialsMutation } = apiSlice;
// baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, mode: 'no-cors'}),