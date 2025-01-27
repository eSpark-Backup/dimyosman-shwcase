import { api } from "./rtk";

export const generalCategoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralCategories: builder.query({
      query: ({ categoryType } = {}) => {
        const baseUrl = "/general/category";
        const queryParams = new URLSearchParams();

        if (categoryType) queryParams.append("categoryType", categoryType);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";
        return {
          url: `${baseUrl}${queryString}`,
          method: "GET",
        };
      },
    }),
    getGeneralSearch: builder.query({
      query: ({ parameters, id, page, pageSize } = {}) => {
        const baseUrl = id ? `/general/search/${id}` : "/general/search";
        const queryParams = new URLSearchParams();

        if (pageSize) queryParams.append("pageSize", pageSize);
        if (page) queryParams.append("page", page);
        if (parameters.entity) queryParams.append("entity", parameters.entity);
        if (parameters.name) queryParams.append("name", parameters.name);
        if (parameters.long) queryParams.append("long", parameters.long);
        if (parameters.lat) queryParams.append("lat", parameters.lat);
        if (parameters.additional)
          queryParams.append("additional", parameters.additional);
        if (parameters.categoryNames)
          queryParams.append("categoryNames", parameters.categoryNames);

        const queryString = queryParams.toString()
          ? `?${queryParams.toString()}`
          : "";
        return {
          url: `${baseUrl}${id ? "" : queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetGeneralCategoriesQuery, useGetGeneralSearchQuery } =
  generalCategoriesApi;
