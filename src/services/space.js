import { api } from './rtk';

export const spaceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newSpace: builder.mutation({
            query: (spaceData) => {
                const formData = new FormData();
                formData.append('spaceName', spaceData?.spaceName);

                const selectedCategories = brandData?.brandCategories
                    ?.filter(item => item.selected)
                    ?.map(item => ({ name: item.name }));

                formData.append('brandCategory', JSON.stringify(selectedCategories));



                const details = {
                    description: brandData?.brandOverview,
                    htmlContent: brandData?.brandTitle,
                };
                formData.append('details', JSON.stringify(details));


                const location = {
                    lat: brandData?.location?.lat,
                    long: brandData?.location?.long,
                    additional: brandData?.mapInstructions
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
    useNewSpaceMutation
} = spaceApi;
