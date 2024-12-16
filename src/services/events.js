import { api } from './rtk';

export const eventApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newEvent: builder.mutation({
            query: (eventData) => {
                const formData = new FormData();
                formData.append("brandId", eventData?.brand?.id)
                formData.append("spaceId", eventData?.space?.id)
                formData.append("eventName", eventData?.eventName)
                formData.append("minLeaseDays", "Hello")

                const selectedCategories = eventData?.eventCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('eventCategory', JSON.stringify(selectedCategories));

                const eventDate = {
                    startDate: eventData?.selectedDate[0],
                    endDate: eventData?.selectedDate[1]
                }
                formData.append('eventDate', JSON.stringify(eventDate));


                const details = {
                    description: eventData?.brandOverview,
                    htmlContent: eventData?.brandTitle,
                };
                formData.append('details', JSON.stringify(details));


                const location = {
                    lat: eventData?.location?.lat,
                    long: eventData?.location?.long,
                    additional: eventData?.mapInstructions
                };
                formData.append('location', JSON.stringify(location));


                if (brandData?.cover) {
                    brandData.cover.forEach((file) => {
                        formData.append('cover', file);
                    });
                }
                if (brandData?.profileImage) {
                    formData.append('image', brandData.profileImage);
                }
                formData.append("status", brandData?.status)


                return {
                    url: '/brand',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['brand'],
        }),

    }),
});

export const {
    useNewBrandMutation,
} = eventApi;
