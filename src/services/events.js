import { api } from './rtk';

export const eventApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newEvent: builder.mutation({
            query: (eventData) => {
                const formData = new FormData();
                formData.append("brandId", eventData?.brand?.id)
                formData.append("spaceId", eventData?.space?.id)
                formData.append("eventName", eventData?.eventName)
                // formData.append("minLeaseDays", "Hello")

                const selectedCategories = eventData?.eventCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('eventCategory', JSON.stringify(selectedCategories));


                const formattedDates = [{
                    startDate: eventData.selectedDate[0],
                    endDate: eventData.selectedDate[1]
                }];
                formData.append('eventDate', JSON.stringify(formattedDates));


                const details = {
                    description: eventData?.eventOverview,
                    htmlContent: eventData?.eventTitle,
                };
                formData.append('details', JSON.stringify(details));


                const location = {
                    lat: eventData?.location?.lat,
                    long: eventData?.location?.long,
                    additional: eventData?.mapInstructions
                };
                formData.append('location', JSON.stringify(location));


                if (eventData?.cover) {
                    const coverOrder = [];

                    eventData.cover.forEach((file) => {
                        formData.append('cover', file);
                        coverOrder.push(file.name);
                    });

                    formData.append('coverOrder', JSON.stringify(coverOrder));
                }
                if (eventData?.profileImage) {
                    formData.append('image', eventData.profileImage);
                }
                formData.append("status", eventData?.status)            


                return {
                    url: '/event',
                    method: 'POST',
                    body: formData,
                };
            },
        }),

    }),
});

export const {
    useNewEventMutation,
} = eventApi;
