import { api } from './rtk';

export const eventApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newEvent: builder.mutation({
            query: (eventData) => {
                const formData = new FormData();
                if (eventData?.brand?.id) formData.append("brandId", eventData?.brand?.id)
                if (eventData?.toSendSpace && eventData?.toSendSpace !== "None") formData.append("spaceId", eventData?.toSendSpace)
                formData.append("eventName", eventData?.eventName)
                // formData.append("minLeaseDays", "Hello")

                const selectedCategories = eventData?.eventCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('eventCategory', JSON.stringify(selectedCategories));


                const formattedDates = eventData.selectedDate[0] ?
                 [{
                    startDate: eventData.selectedDate[0],
                    endDate: eventData.selectedDate[1]
                }] : [{
                    startDate: "string",
                    endDate: "string"
                }]
                formData.append('eventDate', JSON.stringify(formattedDates));


                const details = {
                    description: eventData?.eventOverview,
                    htmlContent: eventData?.eventTitle,
                };
                formData.append('details', JSON.stringify(details));


                // const location = {
                //     lat: eventData?.location?.lat,
                //     long: eventData?.location?.long,
                //     additional: eventData?.mapInstructions
                // };
                // formData.append('location', JSON.stringify(location));


                if (eventData?.cover && Object.keys(eventData?.cover).length > 0) {
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
                if (eventData?.leaseId !== "") {
                    formData.append('leaseId', eventData.leaseId);
                }
                formData.append("status", eventData?.status)


                return {
                    url: '/event',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        getAllEvents: builder.query({
            query: ({ publicProfile, entity, id, page, pageSize, tab } = {}) => {
                const baseUrl = publicProfile ? `/general/public/entity/profile/${id}` : id ? `/event/${id}` : '/event';
                const queryParams = new URLSearchParams();

                if (pageSize) queryParams.append('pageSize', pageSize);
                if (page) queryParams.append('page', page);
                if (tab) queryParams.append("tab", tab);
                if (entity) queryParams.append('entity', entity);

                const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
                return {
                    url: `${baseUrl}${publicProfile ? queryString : id ? '' : queryString}`,
                    method: 'GET',
                };
            },
        }),
        editEvent: builder.mutation({
            query: ({ eventData, id }) => {
                const formData = new FormData();
                formData.append('eventName', eventData?.eventName);
                formData.append("spaceId", eventData?.toSendSpace)
                const selectedCategories = eventData?.eventCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('eventCategory', JSON.stringify(selectedCategories));
                const formattedDates = eventData.selectedDate[0] && typeof eventData.selectedDate[0] !== "object" ?
                 [{
                    startDate: eventData.selectedDate[0],
                    endDate: eventData.selectedDate[1]
                }] : [{
                    startDate: "string",
                    endDate: "string"
                }]
                formData.append('eventDate', JSON.stringify(formattedDates));

                const details = {
                    description: eventData?.eventOverview,
                    htmlContent: eventData?.eventTitle,
                };
                formData.append('details', JSON.stringify(details));


                if (eventData?.cover && Object.keys(eventData?.cover).length > 0) {
                    const coverKeys = [];

                    eventData.cover.forEach((file, index) => {
                        if (file?.public_id) {
                            let indexes = index + 1;
                            let newStr = file.public_id + "+" + indexes;
                            coverKeys.push(newStr);
                        } else {
                            formData.append('cover', file);
                        }
                    });

                    if (coverKeys?.length > 0) {
                        formData.append('coverKeys', coverKeys);
                    }
                }

                if (eventData?.leaseId !== "") {
                    formData.append('leaseId', eventData.leaseId);
                }


                if (eventData?.profileImage) {
                    if (eventData.profileImage instanceof File) {
                        formData.append('image', eventData.profileImage);
                    }
                }
                formData.append("status", eventData?.status)

                return {
                    url: `/event/${id}`,
                    method: 'PUT',
                    body: formData,
                };
            },
        }),
        addRsvpDate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `/event/rsvp/${id}`,
                method: "POST",
                body: credentials,
                credentials: "include",
            }),
        }),
        cancelRsvp: builder.mutation({
            query: ({ id }) => ({
                url: `/event/rsvp/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useNewEventMutation,
    useGetAllEventsQuery,
    useEditEventMutation,
    useAddRsvpDateMutation,
    useCancelRsvpMutation,
} = eventApi;
