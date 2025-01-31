import { api } from "./rtk";

export const favouritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavourites: builder.query({
      query: ({ page, pageSize, entity } = {}) => {
        const baseUrl = "/user/favourites";
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
    addInFavourites: builder.mutation({
      query: (credentials) => ({
        url: "/user/favourites",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetFavouritesQuery, useAddInFavouritesMutation } =
  favouritesApi;
