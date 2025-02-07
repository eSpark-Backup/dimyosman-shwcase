import { api } from "./rtk";

export const followersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFollowBrands: builder.query({
      query: ({ page, pageSize, entity } = {}) => {
        const baseUrl = "/user/follow";
        const queryParams = new URLSearchParams();

        if (pageSize) queryParams.append("pageSize", pageSize);
        if (page) queryParams.append("page", page);
        if (entity) queryParams.append("entity", entity);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";
        return {
          url: `${baseUrl}${queryString}`,
          method: "GET",
        };
      },
    }),
    follow: builder.mutation({
      query: (credentials) => ({
        url: "/user/follow",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetFollowBrandsQuery, useFollowMutation } =
followersApi;
