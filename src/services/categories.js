import { api } from './rtk';

export const categoriesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (type) => ({
                url: `/category?type=${type}`,
            }),
        }),
    }),
});

export const {
    useGetCategoriesQuery
} = categoriesApi;
