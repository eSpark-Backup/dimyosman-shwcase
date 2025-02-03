import { api } from "./rtk";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationData: builder.query({
      query: ({ page, pageSize } = {}) => {
        const baseUrl = `/user/notifications`;
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

export const { useGetNotificationDataQuery } = notificationApi;
