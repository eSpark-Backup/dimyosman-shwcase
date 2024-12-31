import { api } from "./rtk";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => ({
        url: "/chat/my",
        method: "GET",
      }),
    }),
    getChatsForContacts: builder.query({
      query: ({ id, page, pageSize } = {}) => {
        const baseUrl = `/chat/message/${id}`;
        const queryParams = new URLSearchParams();

        if (pageSize) queryParams.append("pageSize", pageSize);
        if (page) queryParams.append("page", page);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";
        return {
          url: `${baseUrl}${queryString}`,
          method: "GET",
        };
      },
    }),
    getAllChatDetails: builder.query({
      query: ({ id, page, pageSize } = {}) => {
        const baseUrl = `/chat/${id}`;
        const queryParams = new URLSearchParams();

        if (pageSize) queryParams.append("pageSize", pageSize);
        if (page) queryParams.append("page", page);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";
        return {
          url: `${baseUrl}${queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetMyChatsQuery,
  useGetChatsForContactsQuery,
  useGetAllChatDetailsQuery,
} = chatApi;
