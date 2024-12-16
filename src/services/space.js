import { api } from './rtk';

export const spaceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllSpace: builder.query({
            query: ({ id, page, pageSize } = {}) => {
                const baseUrl = id ? `/space/${id}` : '/space';
                const queryParams = new URLSearchParams();
        
                if (pageSize) queryParams.append('pageSize', pageSize);
                if (page) queryParams.append('page', page);
        
                const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
                return {
                    url: `${baseUrl}${id ? '' : queryString}`,
                    method: 'GET',
                };
            },
        }),

    }),
});

export const {
    useGetAllSpaceQuery,
} = spaceApi;
