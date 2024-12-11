import { api } from './rtk';

export const brandApi = api.injectEndpoints({
    endpoints: (builder) => ({
        newBrand: builder.mutation({
            query: (brandData) => {
                const formData = new FormData();
                formData.append('brandName', brandData?.brandName);

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
        getAllBrands: builder.query({
            query: ({ id, page, pageSize } = {}) => {
                const baseUrl = id ? `/brand/${id}` : `/brand`;
                const queryParams = new URLSearchParams();

                if (pageSize) queryParams.append('pageSize', pageSize);
                if (page) queryParams.append('page', page);

                const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
                return {
                    url: `${baseUrl}${id ? '' : queryString}`,
                    method: 'GET',
                };
            },
            providesTags: ['brand'],
        }),
        editBrand: builder.mutation({
            query: ({ brandData, id }) => {
                const formData = new FormData();
                formData.append('brandName', brandData?.brandName);

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
                };
                formData.append('location', JSON.stringify(location));


                if (brandData?.cover) {
                    const coverKeys = [];

                    brandData.cover.forEach((file) => {
                        if (file?.public_id) {
                            coverKeys.push(file.public_id);
                        } else {
                            formData.append('cover', file);
                        }
                    });


                    // if (coverKeys.length > 0) {
                    formData.append('coverKeys', JSON.stringify(coverKeys));
                    // }
                }

                if (brandData?.profileImage) {
                    if (brandData.profileImage instanceof File) {
                        formData.append('image', brandData.profileImage);
                    }
                }
                formData.append("status", brandData?.status)


                return {
                    url: `/brand/${id}`,
                    method: 'PUT',
                    body: formData,
                };
            },
            providesTags: ['brand'],
        }),

    }),
});

export const {
    useNewBrandMutation,
    useGetAllBrandsQuery,
    useEditBrandMutation
} = brandApi;
