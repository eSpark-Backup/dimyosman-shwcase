import { api } from './rtk';

export const activityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getActivityData: builder.query({
            query: ({ id, page, pageSize } = {}) => {
                // Use the provided `id` or the literal string `{id}`
                const baseUrl = id ? `/space/publishedSpace/${id}` : `/space/publishedSpace/{id}`;
                const queryParams = new URLSearchParams();
        
                if (pageSize) queryParams.append('pageSize', pageSize);
                if (page) queryParams.append('page', page);
        
                const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
                return {
                    url: `${baseUrl}${queryString}`, // Append the query string to the base URL
                    method: 'GET',
                };
            },
        }),
        

    }),
});

export const {
    useGetActivityDataQuery
} = activityApi;