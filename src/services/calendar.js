import { api } from './rtk';

export const CalendarApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCalendar: builder.query({
            query: ({ id, page, pageSize } = {}) => {
                const baseUrl = id ? `/user/calender/${id}` : '/user/calender';
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
    useGetCalendarQuery
} = CalendarApi;
