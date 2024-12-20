import { api } from './rtk';

export const amenitiesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAmenities: builder.query({
            query: () => ({
                url: `/amenities`,
            }),
        }),
    }),
});

export const {
    useGetAmenitiesQuery
} = amenitiesApi;
