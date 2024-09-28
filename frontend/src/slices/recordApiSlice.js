import { RECORD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const recordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecord: builder.query({
      query: () => ({
        url: RECORD_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getRecordById: builder.query({
      query: (recordId) => ({
        url: `${RECORD_URL}/${recordId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addRecord: builder.mutation({
      query: (newRecord) => ({
        url: `${RECORD_URL}`,
        method: "POST",
        body: newRecord, // Send the newRecord data in the request body
      }),
      invalidatesTags: ["Record"],
    }),
    updateRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORD_URL}/${data.recordId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Record"],
    }),
    deleteRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORD_URL}/${data.recordId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Record"],
    }),
  }),
});

export const {
  useGetRecordQuery,
  useGetRecordByIdQuery,
  useAddRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} = recordApiSlice;
