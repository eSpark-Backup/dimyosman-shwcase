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
      async queryFn(
        { chats, page, pageSize },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        const promises = chats.map((id) => {
          const queryParams = new URLSearchParams();
          if (pageSize) queryParams.append("pageSize", pageSize);
          if (page) queryParams.append("page", page);

          const queryString = queryParams.toString()
            ? `?${queryParams.toString()}`
            : "";

          return fetchWithBQ(`/chat/message/${id}${queryString}`);
        });

        try {
          const responses = await Promise.all(promises);

          return { data: responses.map((response) => response.data) };
        } catch (error) {
          return { error: error.message || "Failed to fetch chat messages" };
        }
      },
    }),
    getAllChatDetails: builder.query({
      async queryFn(
        { chats, page, pageSize },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        const promises = chats.map((id) => {
          const queryParams = new URLSearchParams();
          if (pageSize) queryParams.append("pageSize", pageSize);
          if (page) queryParams.append("page", page);

          const queryString = queryParams.toString()
            ? `?${queryParams.toString()}`
            : "";

          return fetchWithBQ(`/chat/${id}${queryString}`);
        });

        try {
          const responses = await Promise.all(promises);

          return { data: responses.map((response) => response.data) };
        } catch (error) {
          return { error: error.message || "Failed to fetch chat messages" };
        }
      },
    }),
  }),
});

export const {
  useGetMyChatsQuery,
  useGetChatsForContactsQuery,
  useGetAllChatDetailsQuery,
} = chatApi;
