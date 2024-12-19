import { api } from './rtk';

export const spaceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newSpace: builder.mutation({
            query: (spaceData) => {
                const formData = new FormData();
                formData.append("brandId", spaceData?.selectedBrand)
                formData.append("spaceName", spaceData?.spaceName)
                formData.append("minLeaseDays", "Day")

                const selectedCategories = spaceData?.spaceCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('spaceCategory', JSON.stringify(selectedCategories));

                const selectedAmenities = spaceData?.amenities
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name, iconUrl: item?.icon }));

                formData.append('amenity', JSON.stringify(selectedAmenities));

                const details = {
                    description: spaceData?.spaceOverview,
                    htmlContent: spaceData?.spaceTitle,
                };
                formData.append('details', JSON.stringify(details));


                const location = {
                    lat: spaceData?.location?.lat,
                    long: spaceData?.location?.long,
                    additional: spaceData?.mapInstructions
                };
                formData.append('location', JSON.stringify(location));

                if (spaceData?.cover) {
                    const coverOrder = [];

                    spaceData.cover.forEach((file) => {
                        formData.append('cover', file);
                        coverOrder.push(file.name);
                    });

                    // formData.append('coverOrder', JSON.stringify(coverOrder));
                }
                if (spaceData?.profileImage) {
                    formData.append('image', spaceData.profileImage);
                }
                formData.append("status", spaceData?.status)


                return {
                    url: '/space',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
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
    useNewSpaceMutation,
    useGetAllSpaceQuery,
} = spaceApi;
